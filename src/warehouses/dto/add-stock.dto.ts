import { IsNumber } from 'class-validator';

export class AddStockDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;
}
