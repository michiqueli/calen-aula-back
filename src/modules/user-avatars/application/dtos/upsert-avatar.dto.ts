import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * DTO para crear o actualizar el avatar de un usuario.
 */
export class UpsertAvatarDto {
  @ApiProperty({ description: 'ID del avatar', example: 'avatar_01' })
  @IsString()
  avatarId!: string;

  @ApiProperty({ description: 'Nombre del avatar', example: 'Robot Blue' })
  @IsString()
  avatarName!: string;
}
