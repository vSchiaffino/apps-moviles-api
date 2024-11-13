import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Sale extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @OneToMany(() => SaleProduct, (saleProduct) => saleProduct.sale, {
    eager: true,
    cascade: true,
  })
  products: SaleProduct[];
}

@Entity()
export class SaleProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sale, (sale) => sale.products)
  sale: Sale;

  @Column()
  productId: number;

  @Column()
  quantity: number;
}
