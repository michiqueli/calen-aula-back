import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { FechaImportanteAnexo } from '../../../fechas-importantes/domain/entities/fecha-importante-anexo.entity.js';

/**
 * Entidad de dominio que representa un anexo del usuario.
 */
@Entity('anexos')
export class Anexo {
  @ApiProperty({ description: 'ID único del anexo', example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Número del anexo', example: 1 })
  @Column({ type: 'integer' })
  numero!: number;

  @ApiProperty({ description: 'Título del anexo', example: 'Anexo 1' })
  @Column({ type: 'text' })
  titulo!: string;

  @ApiProperty({ description: 'ID del usuario propietario' })
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @ApiProperty({ description: 'Fechas importantes asociadas', type: () => [FechaImportanteAnexo] })
  @OneToMany(() => FechaImportanteAnexo, (fecha) => fecha.anexo)
  fechasImportantesAnexo!: FechaImportanteAnexo[];
}
