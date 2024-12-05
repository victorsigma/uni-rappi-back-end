import { IsNotEmpty, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSaleDto {
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    cancel: boolean;
}