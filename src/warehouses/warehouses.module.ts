import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouses.service';
import { WarehouseController } from './warehouses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse]), ProductsModule],
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class WarehousesModule {}
