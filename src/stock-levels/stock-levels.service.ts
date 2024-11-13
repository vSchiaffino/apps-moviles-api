import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStockLevelDto } from './dto/create-stock-level.dto';
import { UpdateStockLevelDto } from './dto/update-stock-level.dto';
import { StockLevel } from './entities/stock-level.entity';
import { StockLevelProduct } from './entities/stock-level-product.entity';

@Injectable()
export class StockLevelsService {
  async create(createStockLevelDto: CreateStockLevelDto) {
    const exists = await StockLevel.findOneBy({
      date: createStockLevelDto.date as any,
    });
    if (exists)
      throw new BadRequestException('Stock level already exists for this date');
    const result = StockLevel.create(createStockLevelDto);
    const stockLevel = await result.save();
    await StockLevelProduct.save<StockLevelProduct>(
      createStockLevelDto.products.map((product) => ({
        finalStock: product.finalStock,
        initialStock: product.initialStock,
        stockLevel: { id: stockLevel.id },
        product: { id: product.productId },
      })),
    );
    return StockLevel.findOneBy({ date: createStockLevelDto.date as any });
  }

  async getByDate(date: Date) {
    const stockLevel = await StockLevel.findOne({ where: { date } });
    if (!stockLevel) throw new NotFoundException('Stock level not found');
    return stockLevel;
  }

  async update(id: number, updateStockLevelDto: UpdateStockLevelDto) {
    const stockLevel = await StockLevel.findOneBy({ id });
    await Promise.all(
      updateStockLevelDto.products.map(async (product) => {
        const stockLevelProduct = await StockLevelProduct.findOneBy({
          stockLevel: { id },
          product: { id: product.productId },
        });
        stockLevelProduct.initialStock = product.initialStock;
        stockLevelProduct.finalStock = product.finalStock;
        await stockLevelProduct.save();
      }),
    );
    await stockLevel.save();
    return await StockLevel.findOneBy({ id });
  }

  remove(id: number) {
    return `This action removes a #${id} stockLevel`;
  }
}
