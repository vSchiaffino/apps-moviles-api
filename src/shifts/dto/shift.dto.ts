import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';

export default class ShiftStockDto {
  @IsNotEmpty()
  @IsNumber()
  warehouseId: number;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  stock: StockLevelDto[];
}

export class StockLevelDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive({ message: 'La cantidad debe ser positiva' })
  quantity: number;
}
