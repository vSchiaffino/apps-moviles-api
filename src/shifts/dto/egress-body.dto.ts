import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class EgressBodyDto {
  @IsNotEmpty()
  @IsNumber()
  warehouseId: number;

  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'La cantidad debe ser positiva' })
  quantity: number;
}
