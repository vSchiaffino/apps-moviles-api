import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StockLevelProduct } from './stock-level-product.entity';

@Entity()
export class StockLevel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @OneToMany(
    () => StockLevelProduct,
    (stockLevelProduct) => stockLevelProduct.stockLevel,
    { eager: true },
  )
  products: StockLevelProduct[];
}
