import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    productname: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    productDescription: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    stock: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    idMenu: number;
}