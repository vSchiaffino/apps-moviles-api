import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import ShiftStockDto from './dto/shift.dto';

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

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.shiftsService.getShift(id);
  }

  @Post('/end')
  endShift(@Body() shifts: ShiftStockDto[]) {
    return this.shiftsService.endCurrentShift(shifts);
  }
}
