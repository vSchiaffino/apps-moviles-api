import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import ShiftStockDto from '../dto/shift.dto';

@Entity()
export class Shift extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  startDate: Date;

  @Column({ type: 'jsonb' })
  startStock: ShiftStockDto[];

  @Column({ default: null, nullable: true })
  endDate?: Date;

  @Column({ type: 'jsonb', nullable: true })
  endStock?: ShiftStockDto[];

  @Column({ type: 'jsonb', nullable: true })
  missing?: ShiftStockDto[];
}
