import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiPropertyOptional({ enum: ['user', 'admin', 'vendedor']})
  role?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  controlNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  group?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  fullName?: string;
}
