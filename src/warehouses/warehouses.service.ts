import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';

import { Warehouse } from './entities/warehouse.entity';
import { AddStockDto } from './dto/add-stock.dto';
import { Repository } from 'typeorm';
import { WarehouseStock } from './entities/warehouse-stock.entity';
import { TransferBodyDto } from './dto/transfer-body.dto';

@Injectable()
export class WarehouseService extends TypeOrmCrudService<Warehouse> {
  constructor(@InjectRepository(Warehouse) repo: Repository<Warehouse>) {
    super(repo);
  }

  async addStock(warehouseId: number, body: AddStockDto) {
    const warehouse = await this.repo.findOneBy({ id: warehouseId });

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
    const productPromise = this.repo.findOneBy({ id: productId });

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
}
