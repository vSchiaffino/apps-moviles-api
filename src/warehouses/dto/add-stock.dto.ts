import { IsNumber, IsPositive } from 'class-validator';

export class AddStockDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @IsPositive({ message: 'La cantidad debe ser positiva' })
  quantity: number;
}
