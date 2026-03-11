import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO para el inicio de sesión.
 */
export class LoginDto {
  @ApiProperty({ description: 'Email del usuario', example: 'usuario@email.com' })
  @IsEmail({}, { message: 'El email no es válido' })
  email!: string;

  @ApiProperty({ description: 'Contraseña', example: 'password123' })
  @IsString()
  @MinLength(6)
  password!: string;
}
