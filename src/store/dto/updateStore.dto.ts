import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStoreDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  storename?: string;

  
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description?: string;
}
