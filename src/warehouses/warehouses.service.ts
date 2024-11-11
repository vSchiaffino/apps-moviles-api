import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';

import { Warehouse } from './entities/warehouse.entity';
import { CrudRequest } from '@dataui/crud';
import { AddStockDto } from './dto/add-stock.dto';
import { Repository } from 'typeorm';
import { WarehouseStock } from './entities/warehouse-stock.entity';

@Injectable()
export class WarehouseService extends TypeOrmCrudService<Warehouse> {
  constructor(@InjectRepository(Warehouse) repo: Repository<Warehouse>) {
    super(repo);
  }

  async addStock(warehouseId: number, body: AddStockDto) {
    const warehouse = await this.repo.findOneBy({ id: warehouseId });
    console.log(warehouse);

    if (!warehouse) throw new NotFoundException('Warehouse not found');

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
}
