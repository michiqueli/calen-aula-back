import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PeriodoLectivo } from '../../../periodos-lectivos/domain/entities/periodo-lectivo.entity.js';

/**
 * Entidad de dominio que representa un rango lectivo.
 */
@Entity('rangosLectivos')
export class RangoLectivo {
  @ApiProperty({ description: 'ID único del rango lectivo', example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'ID del periodo lectivo asociado', example: 'uuid-v4' })
  @Column({ type: 'uuid', name: 'periodo_id' })
  periodoId!: string;

  @ManyToOne(() => PeriodoLectivo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'periodo_id' })
  periodo!: PeriodoLectivo;

  @ApiProperty({ description: 'Tipo del rango lectivo', example: 'trimestre' })
  @Column({ type: 'text' })
  tipo!: string;

  @ApiProperty({ description: 'Título del rango lectivo', example: 'Primer Trimestre' })
  @Column({ type: 'text' })
  titulo!: string;

  @ApiProperty({ description: 'Fecha de inicio', example: '2025-09-01' })
  @Column({ type: 'date', name: 'fecha_inicio' })
  fechaInicio!: string;

  @ApiProperty({ description: 'Fecha de fin', example: '2025-12-20' })
  @Column({ type: 'date', name: 'fecha_fin' })
  fechaFin!: string;

  @ApiProperty({ description: 'Orden de visualización', example: 1 })
  @Column({ type: 'integer' })
  orden!: number;

  @ApiProperty({ description: 'Notas adicionales', required: false })
  @Column({ type: 'text', nullable: true })
  notas!: string | null;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}
