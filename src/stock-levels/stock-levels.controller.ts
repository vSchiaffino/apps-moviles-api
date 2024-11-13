import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { StockLevelsService } from './stock-levels.service';
import { CreateStockLevelDto } from './dto/create-stock-level.dto';
import { UpdateStockLevelDto } from './dto/update-stock-level.dto';

@Controller('stock-levels')
export class StockLevelsController {
  constructor(private readonly stockLevelsService: StockLevelsService) {}

  @Post()
  create(@Body() createStockLevelDto: CreateStockLevelDto) {
    return this.stockLevelsService.create(createStockLevelDto);
  }

  @Get()
  findOne(@Query('date', new ValidationPipe({ transform: true })) date: Date) {
    return this.stockLevelsService.getByDate(date);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateStockLevelDto: UpdateStockLevelDto,
  ) {
    return this.stockLevelsService.update(+id, updateStockLevelDto);
  }
}
