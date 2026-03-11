import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

/**
 * DTO para crear un rango lectivo.
 */
export class CreateRangoLectivoDto {
  @ApiProperty({ description: 'ID del periodo lectivo asociado', example: 'uuid-v4' })
  @IsUUID()
  periodoId!: string;

  @ApiProperty({ description: 'Tipo del rango lectivo', example: 'trimestre' })
  @IsString()
  tipo!: string;

  @ApiProperty({ description: 'Título del rango lectivo', example: 'Primer Trimestre' })
  @IsString()
  titulo!: string;

  @ApiProperty({ description: 'Fecha de inicio', example: '2025-09-01' })
  @IsDateString()
  fechaInicio!: string;

  @ApiProperty({ description: 'Fecha de fin', example: '2025-12-20' })
  @IsDateString()
  fechaFin!: string;

  @ApiProperty({ description: 'Orden de visualización', example: 1 })
  @IsInt()
  orden!: number;

  @ApiProperty({ description: 'Notas adicionales', required: false })
  @IsOptional()
  @IsString()
  notas?: string;
}
