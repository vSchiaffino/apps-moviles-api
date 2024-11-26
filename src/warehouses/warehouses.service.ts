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

@Injectable()
export class WarehouseService extends TypeOrmCrudService<Warehouse> {
  constructor(@InjectRepository(Warehouse) repo: Repository<Warehouse>) {
    super(repo);
  }

  actualStockOf(warehouse: Warehouse) {
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
