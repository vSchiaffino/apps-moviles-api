import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { WarehouseStock } from 'src/warehouses/entities/warehouse-stock.entity';
import { StockLevel } from 'src/stock-levels/entities/stock-level.entity';
import { ShiftEgress } from 'src/shifts/entities/shift-egress.entity';

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

  @OneToMany(() => StockLevel, (stockLevel) => stockLevel.products, {
    onDelete: 'CASCADE',
  })
  stockLevels: StockLevel[];

  @OneToMany(() => ShiftEgress, (egress) => egress.product)
  egresses: ShiftEgress[];
}
