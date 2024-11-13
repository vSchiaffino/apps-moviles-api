import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { WarehouseStock } from 'src/warehouses/entities/warehouse-stock.entity';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => WarehouseStock, (warehouseStock) => warehouseStock.product, {
    onDelete: 'CASCADE',
  })
  storedIn: WarehouseStock[];
}
