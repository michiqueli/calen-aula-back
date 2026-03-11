import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO con los datos públicos del usuario.
 */
export class UserResponseDto {
  @ApiProperty({ description: 'ID del usuario' })
  id!: string;

  @ApiProperty({ description: 'Email del usuario' })
  email!: string;

  @ApiProperty({ description: 'Nombre completo' })
  fullName!: string;
}

/**
 * DTO de respuesta para operaciones de autenticación.
 */
export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken!: string;

  @ApiProperty({ description: 'Datos del usuario', type: UserResponseDto })
  user!: UserResponseDto;
}
