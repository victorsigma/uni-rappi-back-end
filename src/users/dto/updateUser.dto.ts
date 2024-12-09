import { IsString, IsOptional, IsEnum, IsEmail, IsPhoneNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto.' })
  @ApiPropertyOptional()
  username?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @ApiPropertyOptional()
  password?: string;

  @IsOptional()
  @IsEnum(['user', 'admin', 'vendedor'], { message: 'El rol debe ser uno de los siguientes: user, admin o vendedor.' })
  @ApiPropertyOptional({ enum: ['user', 'admin', 'vendedor']})
  role?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido.' })
  @IsString({ message: 'El correo electrónico debe ser una cadena de texto.' })
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('MX', { message: 'El número de teléfono no tiene un formato válido.' })
  @ApiPropertyOptional({ description: 'Número de teléfono en formato válido E.164.' })
  phonenumber?: string;

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
