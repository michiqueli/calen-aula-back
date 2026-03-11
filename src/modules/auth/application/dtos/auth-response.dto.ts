import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de respuesta para operaciones de autenticación.
 */
export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken!: string;

  @ApiProperty({ description: 'Datos del usuario' })
  user!: UserResponseDto;
}

export class UserResponseDto {
  @ApiProperty({ description: 'ID del usuario' })
  id!: string;

  @ApiProperty({ description: 'Email del usuario' })
  email!: string;

  @ApiProperty({ description: 'Nombre completo' })
  fullName!: string;
}
