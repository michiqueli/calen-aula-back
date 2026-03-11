import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

/**
 * DTO para subir un archivo.
 */
export class UploadArchivoDto {
  @ApiProperty({ description: 'Título del archivo', example: 'Mi documento' })
  @IsString()
  titulo!: string;

  @ApiProperty({
    description: 'Descripción del archivo',
    example: 'Descripción opcional',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
