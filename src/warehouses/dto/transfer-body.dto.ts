import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class TransferBodyDto {
  @IsNumber()
  originId: number;

  @IsNumber()
  destinationId: number;

  @IsNumber()
  productId: number;

  @IsInt()
  @IsPositive({ message: 'La cantidad debe ser positiva' })
  quantity: number;
}
