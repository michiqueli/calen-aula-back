import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidad de dominio que representa un periodo del usuario.
 */
@Entity('periodos')
export class Periodo {
  @ApiProperty({ description: 'ID único del periodo', example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Nombre del periodo', example: 'Primer trimestre' })
  @Column({ type: 'text' })
  nombre!: string;

  @ApiProperty({ description: 'ID del usuario propietario' })
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}
