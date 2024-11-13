export class CreateSaleDto {
  date: string;
  products: CreateReportProductSaleDto[];
}

export class CreateReportProductSaleDto {
  productId: number;
  quantity: number;
}
