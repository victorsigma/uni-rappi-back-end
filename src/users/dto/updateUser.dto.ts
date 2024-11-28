import { IsString, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto.' })
  @IsOptional()
  @ApiPropertyOptional()
  username?: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @IsOptional()
  @ApiPropertyOptional()
  password?: string;

  @IsEnum(['user', 'admin', 'vendedor'], { message: 'El rol debe ser uno de los siguientes: user, admin o vendedor.' })
  @IsOptional()
  @ApiPropertyOptional({ enum: ['user', 'admin', 'vendedor']})
  role?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido.' })
  @IsString({ message: 'El correo electrónico debe ser una cadena de texto.' })
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsString({ message: 'El número de control debe ser una cadena de texto.' })
  @ApiProperty()
  controlNumber?: string;

  @IsOptional()
  @IsString({ message: 'El grupo debe ser una cadena de texto.' })
  @ApiProperty()
  group?: string;

  @IsOptional()
  @IsString({ message: 'El nombre completo debe ser una cadena de texto.' })
  @ApiProperty()
  fullName?: string;
}
