import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { StockLevel } from 'src/stock-levels/entities/stock-level.entity';
import { SalesService } from 'src/sales/sales.service';

@Injectable()
export class ReportsService {
  constructor(private readonly salesService: SalesService) {}

  create(createReportDto: CreateReportDto) {
    return 'This action adds a new report';
  }

  async findAll(startDate: string, endDate: string) {
    const stockLevels = await StockLevel.createQueryBuilder('stockLevel')
      .select([
        'stockLevel.date',
        'product.id',
        'products.initialStock',
        'products.finalStock',
        'product.name',
      ])
      .leftJoin('stockLevel.products', 'products')
      .leftJoin('products.product', 'product')
      .where('stockLevel.date >= :startDate', { startDate })
      .andWhere('stockLevel.date <= :endDate', { endDate })
      .getMany();
    const sales = await this.salesService.findAll(startDate, endDate);
    return {
      stockLevels,
      sales,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
