import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';

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
}
