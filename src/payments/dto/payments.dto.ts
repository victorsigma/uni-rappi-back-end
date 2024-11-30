import { IsInt, IsIn, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentsDto {

 
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'Monto a recargar', enum: [100, 300, 500]})
  @IsInt()
  @IsIn([100, 300, 500], { message: 'Solo se permiten recargas de 100, 300 o 500 puntos' })
  amount: number;
}
