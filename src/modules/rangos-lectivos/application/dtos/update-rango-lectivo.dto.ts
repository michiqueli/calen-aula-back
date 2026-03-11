import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

/**
 * DTO para actualizar un rango lectivo.
 * Solo permite actualizar titulo, fechaInicio, fechaFin y notas.
 */
export class UpdateRangoLectivoDto {
  @ApiProperty({ description: 'Título del rango lectivo', required: false })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiProperty({ description: 'Fecha de inicio', required: false })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiProperty({ description: 'Fecha de fin', required: false })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiProperty({ description: 'Notas adicionales', required: false })
  @IsOptional()
  @IsString()
  notas?: string;
}
