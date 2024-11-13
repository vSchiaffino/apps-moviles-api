import { Controller, Delete, Param } from '@nestjs/common';
import { Crud, CrudController, Override } from '@dataui/crud';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Crud({
  model: {
    type: Product,
  },
  dto: {
    create: CreateProductDto,
  },
  query: {
    join: {
      storedIn: {
        eager: true,
      },
      'storedIn.warehouse': {
        eager: true,
      },
    },
  },
})
@Controller('products')
export class ProductsController implements CrudController<Product> {
  constructor(public service: ProductsService) {}

  @Override()
  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    return this.service.customDelete(id);
  }
}
