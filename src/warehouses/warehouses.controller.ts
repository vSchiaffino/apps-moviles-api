import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@dataui/crud';

import { Warehouse } from 'src/warehouses/entities/warehouse.entity';
import { CreateWarehouseDto } from 'src/warehouses/dto/create-warehouse.dto';
import { WarehouseService } from 'src/warehouses/warehouses.service';

//TODO: auth
@Crud({
  model: {
    type: Warehouse,
  },
  dto: {
    create: CreateWarehouseDto,
  },
})
@Controller('warehouses')
export class WarehouseController implements CrudController<Warehouse> {
  constructor(public service: WarehouseService) {}
}
