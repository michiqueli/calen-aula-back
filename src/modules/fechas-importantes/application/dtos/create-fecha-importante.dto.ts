import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsDateString, IsOptional } from 'class-validator';

/**
 * DTO para la creación de una fecha importante.
 */
export class CreateFechaImportanteDto {
  @ApiProperty({ description: 'ID del anexo asociado', example: 'uuid-v4' })
  @IsUUID()
  anexoId!: string;

  @ApiProperty({ description: 'Título de la fecha importante', example: 'Inicio de clases' })
  @IsString()
  titulo!: string;

  @ApiProperty({ description: 'Fecha de inicio', example: '2026-03-01' })
  @IsDateString()
  fechaInicio!: string;

  @ApiPropertyOptional({ description: 'Fecha de fin', example: '2026-03-15' })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiPropertyOptional({ description: 'ID del periodo asociado', example: 'uuid-v4' })
  @IsOptional()
  @IsUUID()
  periodoId?: string;
}
