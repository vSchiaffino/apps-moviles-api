import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ShiftStockDto from '../dto/shift.dto';
import { ShiftEgress } from './shift-egress.entity';

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

  @OneToMany(() => ShiftEgress, (shiftEgress) => shiftEgress.shift)
  egresses: ShiftEgress[];
}
