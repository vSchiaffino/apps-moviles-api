import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive({ message: 'La capacidad debe ser positiva' })
  capacity: number;
}
