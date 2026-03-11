import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsUUID } from 'class-validator';

/**
 * DTO para la actualización de una fecha importante.
 */
export class UpdateFechaImportanteDto {
  @ApiPropertyOptional({ description: 'Título de la fecha importante', example: 'Inicio de clases' })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiPropertyOptional({ description: 'Fecha de inicio', example: '2026-03-01' })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiPropertyOptional({ description: 'Fecha de fin', example: '2026-03-15' })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiPropertyOptional({ description: 'ID del periodo asociado', example: 'uuid-v4' })
  @IsOptional()
  @IsUUID()
  periodoId?: string;
}
