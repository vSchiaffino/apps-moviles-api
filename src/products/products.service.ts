import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';

import { Product } from './entities/product.entity';
import { StockLevelProduct } from 'src/stock-levels/entities/stock-level-product.entity';

@Injectable()
export class ProductsService extends TypeOrmCrudService<Product> {
  constructor(@InjectRepository(Product) repo: any) {
    super(repo);
  }

  async customDelete(id: string) {
    await StockLevelProduct.delete({ product: { id: +id } });
    return this.repo.delete(id);
  }
}
