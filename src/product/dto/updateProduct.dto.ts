import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    productname?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional()
    price?: number;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional()
    stock?: number;
}
