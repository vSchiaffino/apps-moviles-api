import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';

import { Product } from './entities/product.entity';
import { CrudRequest, GetManyDefaultResponse } from '@dataui/crud';

@Injectable()
export class ProductsService extends TypeOrmCrudService<Product> {
  constructor(@InjectRepository(Product) repo: any) {
    super(repo);
  }

  async getMany(
    req: CrudRequest,
  ): Promise<Product[] | GetManyDefaultResponse<Product>> {
    // TODO: set real stock value
    const response: any = await super.getMany(req);
    response.data = response.data.map((product) => ({ ...product, stock: 2 }));
    return response;
  }
}
