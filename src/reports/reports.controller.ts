import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  findAll(@Query('start') startDate, @Query('end') endDate: string) {
    return this.reportsService.findAll(startDate, endDate);
  }
}
