import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de respuesta para el rol de usuario.
 */
export class UserRoleResponseDto {
  @ApiProperty({ description: 'ID del usuario', example: 'uuid-v4' })
  id!: string;

  @ApiProperty({ description: 'Rol del usuario', example: 'usuario' })
  rol!: string;
}
