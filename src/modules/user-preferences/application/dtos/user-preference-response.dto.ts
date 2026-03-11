import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de respuesta para preferencias de usuario.
 */
export class UserPreferenceResponseDto {
  @ApiProperty({ description: 'ID de la preferencia', example: 'uuid-v4' })
  id!: string;

  @ApiProperty({ description: 'ID del usuario', example: 'uuid-v4' })
  userId!: string;

  @ApiProperty({ description: 'Preferencia de tema', example: 'light' })
  themePreference!: string;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt!: Date;
}
