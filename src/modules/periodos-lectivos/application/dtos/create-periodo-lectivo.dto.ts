import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsInt } from 'class-validator';

/**
 * DTO para crear un periodo lectivo.
 */
export class CreatePeriodoLectivoDto {
  @ApiProperty({ description: 'ID del nivel educativo asociado', example: 'uuid-v4' })
  @IsUUID()
  nivelId!: string;

  @ApiProperty({ description: 'Nombre del periodo lectivo', example: '2025-2026' })
  @IsString()
  nombre!: string;

  @ApiProperty({ description: 'Ciclo del periodo lectivo', example: 2025 })
  @IsInt()
  ciclo!: number;
}
