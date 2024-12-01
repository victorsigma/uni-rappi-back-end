import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/product/product.entity';

export class CreateSalesHistoryDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    idUser: number;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty()
    products: Product[];
}
