import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WarehouseStock } from './warehouse-stock.entity';

@Entity()
export class Warehouse extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @OneToMany(() => WarehouseStock, (warehouseStock) => warehouseStock.warehouse, { eager: true })
  stock: WarehouseStock[];
}
