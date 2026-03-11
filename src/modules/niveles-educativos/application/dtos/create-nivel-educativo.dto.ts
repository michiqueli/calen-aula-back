import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

/**
 * DTO para crear un nivel educativo.
 */
export class CreateNivelEducativoDto {
  @ApiProperty({ description: 'Código del nivel educativo', example: 'PRI' })
  @IsString()
  codigo!: string;

  @ApiProperty({ description: 'Título del nivel educativo', example: 'Primaria' })
  @IsString()
  titulo!: string;

  @ApiProperty({ description: 'Descripción del nivel educativo', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ description: 'Orden de visualización', example: 1 })
  @IsInt()
  orden!: number;

  @ApiProperty({ description: 'Si el nivel está activo', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
