import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/product/product.entity';
import { Type } from 'class-transformer';

export class CreateSalesHistoryDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    idUser: number;

    @IsArray()
    @IsNotEmpty()
    @Type(() => Product)
    @ApiProperty()
    products: Product[];
}
