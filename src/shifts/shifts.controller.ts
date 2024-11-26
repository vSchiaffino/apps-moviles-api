import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShiftsService } from './shifts.service';

@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post()
  create() {
    return this.shiftsService.startShift();
  }

  @Get()
  find() {
    return this.shiftsService.getCurrentShift();
  }

  @Post('/end')
  endShift() {
    return this.shiftsService.endCurrentShift();
  }
}
