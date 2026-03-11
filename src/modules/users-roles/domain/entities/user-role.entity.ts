import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidad de dominio que representa el rol de un usuario.
 */
@Entity('users_roles')
export class UserRole {
  @ApiProperty({ description: 'ID del usuario (mismo que users.id)', example: 'uuid-v4' })
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @ApiProperty({ description: 'Rol del usuario', example: 'usuario' })
  @Column({ type: 'text', default: 'usuario' })
  rol!: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}
