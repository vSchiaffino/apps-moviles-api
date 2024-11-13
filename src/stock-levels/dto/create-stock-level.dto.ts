import { Type } from 'class-transformer';
import { IsDateString, Matches } from 'class-validator';

export class CreateStockLevelDto {
  @Type(() => Date)
  date: Date;

  products: {
    productId: number;
    initialStock: number;
    finalStock: number;
  }[];
}
