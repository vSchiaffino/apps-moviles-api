import { Module } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { ShiftsController } from './shifts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from './entities/shift.entity';
import { ShiftGateway } from './shift-gateway.service';
import { WarehousesModule } from 'src/warehouses/warehouses.module';
import { NotificationModule } from 'src/notifications/notifications.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shift]),
    WarehousesModule,
    NotificationModule,
    ProductsModule,
  ],
  controllers: [ShiftsController],
  providers: [ShiftsService, ShiftGateway],
  exports: [ShiftsService, ShiftGateway],
})
export class ShiftsModule {}
