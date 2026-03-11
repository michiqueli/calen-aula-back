import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Anexo } from '../../../anexos/domain/entities/anexo.entity.js';
import { Periodo } from '../../../periodos/domain/entities/periodo.entity.js';

/**
 * Entidad de dominio que representa una fecha importante asociada a un anexo.
 */
@Entity('fechas_importantes_anexo')
export class FechaImportanteAnexo {
  @ApiProperty({ description: 'ID único de la fecha importante', example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'ID del anexo asociado' })
  @Column({ type: 'uuid', name: 'anexo_id' })
  anexoId!: string;

  @ApiProperty({ description: 'Título de la fecha importante', example: 'Inicio de clases' })
  @Column({ type: 'text' })
  titulo!: string;

  @ApiProperty({ description: 'Fecha de inicio', example: '2026-03-01' })
  @Column({ type: 'date', name: 'fecha_inicio' })
  fechaInicio!: string;

  @ApiPropertyOptional({ description: 'Fecha de fin', example: '2026-03-15' })
  @Column({ type: 'date', name: 'fecha_fin', nullable: true })
  fechaFin!: string | null;

  @ApiProperty({ description: 'ID del usuario propietario' })
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @ApiPropertyOptional({ description: 'ID del periodo asociado' })
  @Column({ type: 'uuid', name: 'periodo_id', nullable: true })
  periodoId!: string | null;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @ApiProperty({ description: 'Anexo asociado', type: () => Anexo })
  @ManyToOne(() => Anexo, (anexo) => anexo.fechasImportantesAnexo, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'anexo_id' })
  anexo!: Anexo;

  @ApiPropertyOptional({ description: 'Periodo asociado', type: () => Periodo })
  @ManyToOne(() => Periodo, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'periodo_id' })
  periodo!: Periodo | null;
}
