import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  capacity: number;
}
