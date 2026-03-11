import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de respuesta para el avatar de usuario.
 */
export class UserAvatarResponseDto {
  @ApiProperty({ description: 'ID del registro', example: 'uuid-v4' })
  id!: string;

  @ApiProperty({ description: 'ID del usuario', example: 'uuid-v4' })
  userId!: string;

  @ApiProperty({ description: 'ID del avatar', example: 'avatar_01' })
  avatarId!: string;

  @ApiProperty({ description: 'Nombre del avatar', example: 'Robot Blue' })
  avatarName!: string;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt!: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt!: Date;
}
