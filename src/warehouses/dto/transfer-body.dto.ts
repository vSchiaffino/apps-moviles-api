import { IsNumber, IsPositive } from "class-validator"

export class TransferBodyDto {
    @IsNumber()
    originId: number

    @IsNumber()
    destinationId: number

    @IsNumber()
    productId: number

    @IsNumber()
    @IsPositive()
    quantity: number
}
