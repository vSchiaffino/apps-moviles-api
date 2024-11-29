import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import ShiftStockDto from './dto/shift.dto';
import { ReportQueryDto } from './dto/report-body.dto';

@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post()
  create(@Body() shifts: ShiftStockDto[]) {
    return this.shiftsService.startShift(shifts);
  }

  @Get()
  find() {
    return this.shiftsService.getCurrentShift();
  }

  @Get('report')
  report(@Query() query: ReportQueryDto) {
    return this.shiftsService.getReport(query);
  }

  @Post('/end')
  endShift(@Body() shifts: ShiftStockDto[]) {
    return this.shiftsService.endCurrentShift(shifts);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.shiftsService.getShift(id);
  }
}
