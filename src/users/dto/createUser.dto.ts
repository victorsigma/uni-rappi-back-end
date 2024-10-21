import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @ApiProperty({ enum: ['user', 'admin', 'vendedor'], default: 'user' })
  role: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  controlNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  group: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fullName: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  photo: any;
}
