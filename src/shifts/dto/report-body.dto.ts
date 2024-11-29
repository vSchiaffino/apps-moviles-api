import { IsDate, IsDateString } from 'class-validator';

export class ReportQueryDto {
  @IsDateString()
  startDate: Date;
  @IsDateString()
  endDate: Date;
}
