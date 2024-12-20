import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';

import { Product } from './entities/product.entity';
import { StockLevelProduct } from 'src/stock-levels/entities/stock-level-product.entity';
import { NotificationService } from 'src/notifications/notifications.service';
import { WarehouseStock } from 'src/warehouses/entities/warehouse-stock.entity';
import { LessThanOrEqual } from 'typeorm';

@Injectable()
export class ProductsService extends TypeOrmCrudService<Product> {
  constructor(
    @InjectRepository(Product) repo: any,
    private notificationService: NotificationService,
  ) {
    super(repo);
  }
  
  deleteStocksInZero() {
    return WarehouseStock.delete({ quantity: LessThanOrEqual(0) });
  }

  async checkLowStocks(productsIds?: number[]) {
    const builder = this.repo
      .createQueryBuilder('product')
      .select('product.name', 'name')
      .addSelect('SUM(warehouse_stock.quantity)', 'totalQuantity')
      .innerJoin(
        'warehouse_stock',
        'warehouse_stock',
        'product.id = warehouse_stock.productId',
      )
      .groupBy('product.id')
      .addGroupBy('product.name');
    if (productsIds && productsIds.length > 0)
      builder.andWhere('product.id IN (:...ids)', { ids: productsIds });

    const products = await builder.getRawMany();
    await Promise.all(
      products
        .filter((product) => product.totalQuantity < 10)
        .map((product) =>
          this.notificationService.sendLowStockNotification(product),
        ),
    );
  }

  async customDelete(id: string) {
    await StockLevelProduct.delete({ product: { id: +id } });
    return this.repo.delete(id);
  }
}
