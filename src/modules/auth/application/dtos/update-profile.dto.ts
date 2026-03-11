import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * DTO para actualizar el perfil del usuario.
 */
export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'Nuevo email', example: 'nuevo@email.com' })
  @IsOptional()
  @IsEmail({}, { message: 'El email no es válido' })
  email?: string;

  @ApiPropertyOptional({ description: 'Nueva contraseña' })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @ApiPropertyOptional({ description: 'Nuevo nombre completo', example: 'Juan Pérez' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;
}
