import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  username?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  password?: string;

  @IsEnum(['user', 'admin', 'vendedor'])
  @IsOptional()
  @ApiPropertyOptional({ enum: ['user', 'admin', 'vendedor'], default: 'user' })
  role?: string;
}
