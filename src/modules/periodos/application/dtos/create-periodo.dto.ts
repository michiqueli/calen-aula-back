import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * DTO para la creación de un periodo.
 */
export class CreatePeriodoDto {
  @ApiProperty({ description: 'Nombre del periodo', example: 'Primer trimestre' })
  @IsString()
  nombre!: string;
}
