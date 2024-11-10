import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@dataui/crud';

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
})
@Controller('products')
export class ProductsController implements CrudController<Product> {
  constructor(public service: ProductsService) {}
}
