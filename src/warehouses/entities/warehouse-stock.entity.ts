import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity()
export class WarehouseStock extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.stock, {
    onDelete: 'CASCADE',
  })
  warehouse: Warehouse;

  @ManyToOne(() => Product, (product) => product.storedIn, {
    onDelete: 'CASCADE',
    eager: true,
  })
  product: Product;

  @Column({ type: 'integer' })
  quantity: number;
}
