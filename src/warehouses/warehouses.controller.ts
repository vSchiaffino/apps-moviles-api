import { Body, Controller, Param, Post } from '@nestjs/common';
import { Crud, CrudController } from '@dataui/crud';

import { Warehouse } from 'src/warehouses/entities/warehouse.entity';
import { CreateWarehouseDto } from 'src/warehouses/dto/create-warehouse.dto';
import { WarehouseService } from 'src/warehouses/warehouses.service';
import { TransferBodyDto } from './dto/transfer-body.dto';

@Crud({
  model: {
    type: Warehouse,
  },
  dto: {
    create: CreateWarehouseDto,
  },
  query: {
    join: {
      stock: {
        eager: true,
      },
      'stock.product': {
        eager: true,
      },
    },
  },
})
@Controller('warehouses')
export class WarehouseController implements CrudController<Warehouse> {
  constructor(public service: WarehouseService) {}

  @Post(':id/stock')
  async addStock(@Param('id') id: number, @Body() body: any) {
    return this.service.addStock(id, body);
  }

  @Post('/transfer')
  async transferStock(@Body() body: TransferBodyDto) {
    return this.service.transferStock(body);
  }
}
