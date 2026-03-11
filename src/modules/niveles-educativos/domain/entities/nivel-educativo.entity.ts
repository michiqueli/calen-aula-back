import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidad de dominio que representa un nivel educativo.
 */
@Entity('nivelesEducativos')
export class NivelEducativo {
  @ApiProperty({ description: 'ID único del nivel educativo', example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Código del nivel educativo', example: 'PRI' })
  @Column({ type: 'text' })
  codigo!: string;

  @ApiProperty({ description: 'Título del nivel educativo', example: 'Primaria' })
  @Column({ type: 'text' })
  titulo!: string;

  @ApiProperty({ description: 'Descripción del nivel educativo', required: false })
  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @ApiProperty({ description: 'Orden de visualización', example: 1 })
  @Column({ type: 'integer' })
  orden!: number;

  @ApiProperty({ description: 'Si el nivel está activo', example: true })
  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}
