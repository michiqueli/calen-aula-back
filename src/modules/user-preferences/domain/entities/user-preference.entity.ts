import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidad de dominio que representa las preferencias de un usuario.
 */
@Entity('user_preferencias')
export class UserPreference {
  @ApiProperty({ description: 'ID único de la preferencia', example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'ID del usuario', example: 'uuid-v4' })
  @Column({ type: 'uuid', unique: true, name: 'user_id' })
  userId!: string;

  @ApiProperty({ description: 'Preferencia de tema', example: 'light' })
  @Column({ type: 'varchar', default: 'light', name: 'theme_preference' })
  themePreference!: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}
