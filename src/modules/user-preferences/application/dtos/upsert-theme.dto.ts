import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

/**
 * DTO para actualizar la preferencia de tema.
 */
export class UpsertThemeDto {
  @ApiProperty({ description: 'Preferencia de tema', example: 'light', enum: ['light', 'dark'] })
  @IsString()
  @IsIn(['light', 'dark'])
  themePreference!: string;
}
