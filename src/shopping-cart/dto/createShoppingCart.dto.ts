import { IsNotEmpty, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShoppingCartDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    user_id: number;
}