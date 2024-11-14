import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  storename: string;

  
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  description: number;
}
