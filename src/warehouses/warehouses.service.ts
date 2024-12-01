import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Warehouse } from './entities/warehouse.entity';
import { AddStockDto } from './dto/add-stock.dto';
import { DeepPartial, Repository } from 'typeorm';
import { WarehouseStock } from './entities/warehouse-stock.entity';
import { TransferBodyDto } from './dto/transfer-body.dto';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { CrudRequest } from '@dataui/crud';
import { ProductsService } from 'src/products/products.service';
import { StockLevelDto } from 'src/shifts/dto/shift.dto';

@Injectable()
export class WarehouseService extends TypeOrmCrudService<Warehouse> {
  constructor(
    @InjectRepository(Warehouse) repo: Repository<Warehouse>,
    private productService: ProductsService,
  ) {
    super(repo);
  }

  public async getAll() {
    return this.repo.find({ relations: ['stock', 'stock.product'] });
  }

  public async setAllStock(
    warehouseId: number,
    stocks: StockLevelDto[],
  ): Promise<void> {
    const warehouse = await this.repo.findOneBy({ id: warehouseId });
    if (!warehouse) throw new NotFoundException('Depósito no encontrado');
    await Promise.all(stocks.map((stock) => this.setStock(warehouse, stock)));
    await this.productService.deleteStocksInZero();
  }

  private async setStock(warehouse: Warehouse, stock: StockLevelDto) {
    const stockInDb = warehouse.stock.find(
      (s) => s.product.id === stock.productId,
    );
    stockInDb.quantity = stock.quantity;
    return stockInDb.save();
  }

  public actualStockOf(warehouse: Warehouse) {
    return warehouse.stock.reduce((acc, stock) => acc + stock.quantity, 0);
  }

  async addStock(warehouseId: number, body: AddStockDto) {
    const warehouse = await this.repo.findOneBy({ id: warehouseId });
    const actualStock = this.actualStockOf(warehouse);
    if (actualStock + body.quantity > warehouse.capacity) {
      throw new BadRequestException(
        'El depósito no tiene capacidad suficiente',
      );
    }

    if (!warehouse) throw new NotFoundException('Depósito no encontrado');

    let stock = warehouse.stock.find(
      (stock) => stock.product.id === body.productId,
    );
    if (!stock)
      stock = WarehouseStock.create({
        product: { id: body.productId },
        warehouse,
        quantity: 0,
      });
    stock.quantity += body.quantity;
    await stock.save();
    return stock;
  }

  async transferStock({
    originId,
    destinationId,
    productId,
    quantity,
  }: TransferBodyDto) {
    const originPromise = this.repo.findOneBy({ id: originId });
    const destinationPromise = this.repo.findOneBy({ id: destinationId });
    const productPromise = this.productService.findOneBy({ id: productId });

    const [origin, destination, product] = await Promise.all([
      originPromise,
      destinationPromise,
      productPromise,
    ]);

    if (!product) throw new NotFoundException('Producto no encontrado');
    if (!origin)
      throw new NotFoundException('Depósito de origen no encontrado');
    if (!destination)
      throw new NotFoundException('Depósito de destino no encontrado');

    let originStock = origin.stock.find(
      (stock) => stock.product.id === productId,
    );
    if (!originStock || originStock.quantity < quantity)
      throw new NotFoundException(
        'No hay suficiente stock en el depósito de origen',
      );

    if (origin.id === destination.id)
      throw new BadRequestException(
        'El depósito de origen y destino no pueden ser el mismo',
      );

    if (this.actualStockOf(destination) + quantity > destination.capacity)
      throw new BadRequestException(
        'El depósito de destino no tiene capacidad suficiente',
      );

    let destinationStock = destination.stock.find(
      (stock) => stock.product.id === productId,
    );
    if (!destinationStock)
      destinationStock = WarehouseStock.create({
        product,
        warehouse: destination,
        quantity: 0,
      });

    originStock.quantity -= quantity;
    destinationStock.quantity += quantity;

    await Promise.all([originStock.save(), destinationStock.save()]);

    return {
      message: 'Stock transferred successfully',
    };
  }

  async replaceOne(
    req: CrudRequest,
    dto: DeepPartial<Warehouse>,
  ): Promise<Warehouse> {
    const id = req.parsed.paramsFilter[0].value;
    const warehouse = await this.repo.findOneBy({ id });
    const actualStock = this.actualStockOf(warehouse);
    if (actualStock > dto.capacity) {
      throw new BadRequestException(
        'La capacidad del depósito no puede ser menor al stock actual',
      );
    }
    return super.replaceOne(req, dto);
  }
}
