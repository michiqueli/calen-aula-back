import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { NivelEducativo } from '../../../niveles-educativos/domain/entities/nivel-educativo.entity.js';

/**
 * Entidad de dominio que representa un periodo lectivo.
 */
@Entity('periodosLectivos')
export class PeriodoLectivo {
  @ApiProperty({ description: 'ID único del periodo lectivo', example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'ID del nivel educativo asociado', example: 'uuid-v4' })
  @Column({ type: 'uuid', name: 'nivel_id' })
  nivelId!: string;

  @ManyToOne(() => NivelEducativo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nivel_id' })
  nivel!: NivelEducativo;

  @ApiProperty({ description: 'Nombre del periodo lectivo', example: '2025-2026' })
  @Column({ type: 'text' })
  nombre!: string;

  @ApiProperty({ description: 'Ciclo del periodo lectivo', example: 2025 })
  @Column({ type: 'integer' })
  ciclo!: number;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}
