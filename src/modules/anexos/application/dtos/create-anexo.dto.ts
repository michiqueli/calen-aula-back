import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

/**
 * DTO para la creación de un anexo.
 */
export class CreateAnexoDto {
  @ApiProperty({ description: 'Título del anexo', example: 'Calendario escolar' })
  @IsString()
  titulo!: string;

  @ApiProperty({ description: 'Número del anexo', example: 1 })
  @IsInt()
  numero!: number;
}
