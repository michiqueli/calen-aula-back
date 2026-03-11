import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

/**
 * DTO para sincronizar los filtros de visualización del usuario.
 */
export class SyncFiltersDto {
  @ApiProperty({
    description: 'Filtros de rango lectivo (cada valor debe ser booleano)',
    example: { filter1: true, filter2: false },
  })
  @IsObject()
  filters!: Record<string, boolean>;
}
