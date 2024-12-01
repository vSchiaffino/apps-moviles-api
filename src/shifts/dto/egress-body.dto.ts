import { IsNotEmpty, IsNumber } from 'class-validator';

export class EgressBodyDto {
  @IsNotEmpty()
  @IsNumber()
  warehouseId: number;

  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
