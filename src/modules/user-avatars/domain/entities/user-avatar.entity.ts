import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidad de dominio que representa el avatar de un usuario.
 */
@Entity('user_avatars')
export class UserAvatar {
  @ApiProperty({ description: 'ID único del avatar', example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'ID del usuario', example: 'uuid-v4' })
  @Column({ type: 'uuid', unique: true, name: 'user_id' })
  userId!: string;

  @ApiProperty({ description: 'ID del avatar seleccionado', example: 'avatar_01' })
  @Column({ type: 'varchar', name: 'avatar_id' })
  avatarId!: string;

  @ApiProperty({ description: 'Nombre del avatar', example: 'Robot Blue' })
  @Column({ type: 'varchar', name: 'avatar_name' })
  avatarName!: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}
