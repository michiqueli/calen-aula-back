import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

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

  @ApiPropertyOptional({ description: 'Rango lectivo', example: 'Ciclo Lectivo 2024' })
  @IsOptional()
  @IsString()
  rangoLectivo?: string | null;

  @ApiPropertyOptional({ description: 'Fecha de inicio', example: '2024-03-01' })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string | null;

  @ApiPropertyOptional({ description: 'Fecha de fin', example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  fechaFin?: string | null;
}
