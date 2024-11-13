import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale, SaleProduct } from './entities/sale.entity';

@Injectable()
export class SalesService {
  async create(createSaleDto: CreateSaleDto) {
    let sale = await Sale.findOneBy({ date: createSaleDto.date });
    if (!sale) {
      sale = await Sale.create({ date: createSaleDto.date }).save();
    }
    await Promise.all(
      createSaleDto.products.map(async (product) => {
        let saleProduct = await SaleProduct.findOneBy({
          productId: product.productId,
          sale: { id: sale.id },
        });
        if (!saleProduct)
          saleProduct = SaleProduct.create({
            productId: product.productId,
            quantity: product.quantity,
            sale: { id: sale.id },
          });
        else {
          saleProduct.quantity = product.quantity;
        }
        await saleProduct.save();
      }),
    );
    return Sale.findBy({ id: sale.id });
  }

  findAll(start: string, end: string) {
    return Sale.createQueryBuilder('sale')
      .leftJoinAndSelect('sale.products', 'products')
      .where('sale.date >= :start', { start })
      .andWhere('sale.date <= :end', { end })
      .getMany();
  }

  async delete(id: number) {
    await SaleProduct.delete({ sale: { id } });
    return Sale.delete({ id });
  }
}
