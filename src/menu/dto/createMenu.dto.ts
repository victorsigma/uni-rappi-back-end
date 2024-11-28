import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  menuname: string;

  
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  idStore: number;
}
