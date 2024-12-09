import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  storename: string;

  
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;
}
