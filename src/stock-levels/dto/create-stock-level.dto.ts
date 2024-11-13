import { Type } from 'class-transformer';
import { IsDateString, Matches } from 'class-validator';

export class CreateStockLevelDto {
  date: string;

  products: {
    productId: number;
    initialStock: number;
    finalStock: number;
  }[];
}
