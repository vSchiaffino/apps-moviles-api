import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { SalesService } from 'src/sales/sales.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, SalesService],
})
export class ReportsModule {}
