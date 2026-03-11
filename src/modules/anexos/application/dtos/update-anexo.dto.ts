import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsDateString } from 'class-validator';

/**
 * DTO para la actualización de un anexo.
 */
export class UpdateAnexoDto {
  @ApiPropertyOptional({ description: 'Título del anexo', example: 'Calendario escolar' })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiPropertyOptional({ description: 'Número del anexo', example: 1 })
  @IsOptional()
  @IsInt()
  numero?: number;

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
