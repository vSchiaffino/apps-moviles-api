import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';

import { Warehouse } from './entities/warehouse.entity';
import { CrudRequest } from '@dataui/crud';

@Injectable()
export class WarehouseService extends TypeOrmCrudService<Warehouse> {
  constructor(@InjectRepository(Warehouse) repo: any) {
    super(repo);
  }

  async getMany(req: CrudRequest): Promise<any> {
    // TODO: set real stock value
    const response: any = await super.getMany(req);
    response.data = response.data.map((warehouse) => ({
      ...warehouse,
      stock: 2,
    }));
    return response;
  }
}
