import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsArray,
  ValidateNested,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Elemento individual dentro de una importación masiva de fechas.
 */
export class BulkImportFechaItemDto {
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

  @ApiPropertyOptional({ description: 'Nombre del periodo (se crea si no existe)', example: 'Primer trimestre' })
  @IsOptional()
  @IsString()
  periodoNombre?: string;
}

/**
 * DTO para la importación masiva de fechas importantes.
 */
export class BulkImportFechaDto {
  @ApiProperty({ description: 'ID del anexo asociado', example: 'uuid-v4' })
  @IsUUID()
  anexoId!: string;

  @ApiProperty({ description: 'Lista de fechas a importar', type: [BulkImportFechaItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkImportFechaItemDto)
  fechas!: BulkImportFechaItemDto[];
}
