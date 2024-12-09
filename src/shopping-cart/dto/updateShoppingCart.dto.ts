import { IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateShoppingCartDto {
    @IsObject()
    @IsNotEmpty()
    @Type(() => ProductQuantity)
    @ApiProperty()
    product: {
        id: number,
        quantity: number,
    };
}


class ProductQuantity {
    id: number = 0;
    quantity: number = 0;
}