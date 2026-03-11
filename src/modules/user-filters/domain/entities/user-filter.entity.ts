import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidad de dominio que representa los filtros de visualización de un usuario.
 */
@Entity('user_filtros_visualizacion')
export class UserFilter {
  @ApiProperty({ description: 'ID único del registro', example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'ID del usuario', example: 'uuid-v4' })
  @Column({ type: 'uuid', unique: true, name: 'user_id' })
  userId!: string;

  @ApiProperty({
    description: 'Filtros de rango lectivo',
    example: { filter1: true, filter2: false },
  })
  @Column({ type: 'jsonb', name: 'rango_lectivo_filters', default: {} })
  rangoLectivoFilters!: Record<string, boolean>;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}
