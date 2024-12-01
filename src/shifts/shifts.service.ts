import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IsNull,
  Not,
  Repository,
  LessThanOrEqual,
  MoreThanOrEqual,
  In,
} from 'typeorm';
import { Shift } from './entities/shift.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ShiftGateway } from './shift-gateway.service';
import ShiftStockDto from './dto/shift.dto';
import { WarehouseService } from 'src/warehouses/warehouses.service';
import { Warehouse } from 'src/warehouses/entities/warehouse.entity';
import { ReportQueryDto } from './dto/report-body.dto';
import { Product } from 'src/products/entities/product.entity';
import { NotificationService } from 'src/notifications/notifications.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift) private repo: Repository<Shift>,
    private shiftGateway: ShiftGateway,
    private warehouseService: WarehouseService,
    private notificationService: NotificationService,
    private productService: ProductsService,
  ) {}

  async getReport(query: ReportQueryDto) {
    const shifts = await this.repo.find({
      where: {
        missing: Not(IsNull()),
        startDate: MoreThanOrEqual(new Date(query.startDate)),
        endDate: LessThanOrEqual(new Date(query.endDate)),
      },
    });
    return Promise.all(
      shifts
        .filter(
          (shift) =>
            !!shift.missing &&
            shift.missing.length > 0 &&
            !!shift.startStock &&
            shift.startStock.length > 0 &&
            !!shift.endStock &&
            shift.endStock.length > 0,
        )
        .map((shift) => this.fillProductAndWarehouse(shift)),
    );
  }

  async fillProductAndWarehouse(shift: Shift) {
    const [products, warehouses] = await Promise.all([
      Product.find({
        where: {
          id: In(
            shift.startStock
              .map((s) => s.stock.map((stock) => stock.productId))
              .flat(),
          ),
        },
      }),
      Warehouse.find({
        where: {
          id: In(shift.startStock.map((s) => s.warehouseId)),
        },
      }),
    ]);
    shift.startStock = shift.startStock.map((s) => ({
      ...s,
      stock: s.stock.map((stock) => ({
        ...stock,
        product: products.find((p) => p.id === stock.productId),
      })),
      warehouse: warehouses.find((w) => w.id === s.warehouseId),
    }));
    shift.missing = shift.missing.map((s) => ({
      ...s,
      stock: s.stock.map((stock) => ({
        ...stock,
        product: products.find((p) => p.id === stock.productId),
      })),
      warehouse: warehouses.find((w) => w.id === s.warehouseId),
    }));
    shift.endStock = shift.endStock.map((s) => ({
      ...s,
      stock: s.stock.map((stock) => ({
        ...stock,
        product: products.find((p) => p.id === stock.productId),
      })),
      warehouse: warehouses.find((w) => w.id === s.warehouseId),
    }));
    return shift;
  }

  async endCurrentShift(dtos: ShiftStockDto[]) {
    const shift = await this.getCurrentShift();
    shift.endDate = new Date();
    const warehouses = await this.warehouseService.getAll();
    shift.endStock = dtos;
    shift.missing = this.calculateMissingStock(warehouses, dtos);
    await Promise.all(
      dtos.map(({ warehouseId, stock }) =>
        this.warehouseService.setAllStock(warehouseId, stock),
      ),
    );
    await shift.save();
    this.notifyShiftChange(false);
  }

  private calculateMissingStock(
    warehouses: Warehouse[],
    dtos: ShiftStockDto[],
  ) {
    return dtos.map(({ warehouseId, stock }) => {
      const warehouse = warehouses.find((w) => w.id === warehouseId);
      if (!warehouse) throw new NotFoundException('Depósito no encontrado');
      const missing = stock.map((s) => {
        const stockInDb = warehouse.stock.find(
          (st) => st.product.id === s.productId,
        );
        if (!stockInDb) throw new NotFoundException('Producto no encontrado');
        return { ...s, quantity: stockInDb.quantity - s.quantity };
      });
      return { warehouseId, stock: missing };
    });
  }

  async getShift(id: number) {
    return this.fillProductAndWarehouse(
      await this.repo.findOne({ where: { id } }),
    );
  }

  async getCurrentShift() {
    const shift = await this.repo.findOne({ where: { endDate: IsNull() } });
    if (!shift) throw new NotFoundException('No hay un turno activo');
    return shift;
  }

  async startShift(dtos: ShiftStockDto[]) {
    if (await this.repo.findOne({ where: { endDate: IsNull() } })) {
      throw new BadRequestException('Ya hay un turno activo');
    }
    const shift = await Shift.save({ startDate: new Date(), startStock: dtos });
    await Promise.all(
      dtos.map(({ warehouseId, stock }) =>
        this.warehouseService.setAllStock(warehouseId, stock),
      ),
    );
    this.notifyShiftChange(true);
    return shift;
  }

  async notifyShiftChange(open: boolean) {
    this.shiftGateway.server.emit('shiftChange');
    this.notificationService.sendToAllUsers(
      `Se ${open ? 'inicio' : 'termino'} un turno`,
      `un turno ha sido ${open ? 'iniciado' : 'terminado'}`,
    );
    this.productService.checkLowStocks();
  }
}
