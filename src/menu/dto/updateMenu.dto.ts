import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMenuDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  menuname?: string;
}
