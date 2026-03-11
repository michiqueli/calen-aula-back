import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de respuesta para los filtros de visualización del usuario.
 */
export class UserFilterResponseDto {
  @ApiProperty({ description: 'ID del registro', example: 'uuid-v4' })
  id!: string;

  @ApiProperty({ description: 'ID del usuario', example: 'uuid-v4' })
  userId!: string;

  @ApiProperty({
    description: 'Filtros de rango lectivo',
    example: { filter1: true, filter2: false },
  })
  rangoLectivoFilters!: Record<string, boolean>;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt!: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt!: Date;
}
