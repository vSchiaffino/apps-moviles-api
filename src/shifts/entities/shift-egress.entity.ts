import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Shift } from './shift.entity';
import { Product } from 'src/products/entities/product.entity';
import { Warehouse } from 'src/warehouses/entities/warehouse.entity';

@Entity()
export class ShiftEgress extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Shift, (shift) => shift.egresses)
  shift: Shift;

  @ManyToOne(() => Product, (product) => product.egresses)
  product: Product;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.egresses)
  warehouse: Warehouse;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
