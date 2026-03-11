import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

/**
 * DTO para crear preferencias de usuario.
 */
export class CreatePreferencesDto {
  @ApiPropertyOptional({ description: 'Preferencia de tema', example: 'light' })
  @IsString()
  @IsOptional()
  themePreference?: string;
}
