import { IsString, IsNotEmpty, IsEmail  } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
  @ApiProperty()
  username: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @ApiProperty()
  password: string;

  @ApiProperty({ enum: ['user', 'admin', 'vendedor'], default: 'user' })
  role: string;

  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido.' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @ApiProperty()
  email: string;

  @IsString({ message: 'El número de control debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El número de control es obligatorio.' })
  @ApiProperty()
  controlNumber: string;

  @IsString({ message: 'El grupo debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El grupo es obligatorio.' })
  @ApiProperty()
  group: string;

  @IsString({ message: 'El nombre completo debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre completo es obligatorio.' })
  @ApiProperty()
  fullName: string;
}
