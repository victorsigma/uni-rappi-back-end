import { IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/product/product.entity';
import { Type } from 'class-transformer';

export class CreateSaleDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    user_id: number;

    @IsArray()
    @IsNotEmpty()
    @Type(() => ProductQuantity)
    @ApiProperty()
    products: Array<{id: 0, quantity: 0}>;
}


class ProductQuantity {
    id: number = 0;
    quantity: number = 0;
}