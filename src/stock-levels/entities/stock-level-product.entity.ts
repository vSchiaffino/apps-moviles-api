import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StockLevel } from './stock-level.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity()
export class StockLevelProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StockLevel, (stockLevel) => stockLevel.products)
  stockLevel: StockLevel;

  @ManyToOne(() => Product, (product) => product.stockLevels, {
    eager: true,
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column()
  initialStock: number;

  @Column()
  finalStock: number;
}
