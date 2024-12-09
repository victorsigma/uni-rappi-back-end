import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @IsNotEmpty({ message: 'La foto es obligatoria.' })
  @ApiProperty({ type: 'string', format: 'binary' })
  photo: any;  // El campo que recibirá la imagen
}
