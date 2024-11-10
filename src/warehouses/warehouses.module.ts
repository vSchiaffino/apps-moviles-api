import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouses.service';
import { WarehouseController } from './warehouses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse])],
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class WarehousesModule {}
