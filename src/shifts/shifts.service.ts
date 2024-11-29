import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { Shift } from './entities/shift.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ShiftGateway } from './shift-gateway.service';
import ShiftStockDto from './dto/shift.dto';
import { WarehouseService } from 'src/warehouses/warehouses.service';
import { Warehouse } from 'src/warehouses/entities/warehouse.entity';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift) private repo: Repository<Shift>,
    private shiftGateway: ShiftGateway,
    private warehouseService: WarehouseService,
  ) {}

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
    this.notifyShiftChange();
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
    return await this.repo.find({ where: { id } });
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
    this.notifyShiftChange();
    return shift;
  }

  async notifyShiftChange() {
    this.shiftGateway.server.emit('shiftChange');
  }
}
