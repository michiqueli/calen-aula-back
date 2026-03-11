import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO para el registro de un nuevo usuario.
 */
export class SignupDto {
  @ApiProperty({ description: 'Email del usuario', example: 'usuario@email.com' })
  @IsEmail({}, { message: 'El email no es válido' })
  email!: string;

  @ApiProperty({ description: 'Contraseña (mínimo 6 caracteres)', example: 'password123' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @ApiProperty({ description: 'Nombre completo', example: 'Juan Pérez' })
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  fullName!: string;
}
