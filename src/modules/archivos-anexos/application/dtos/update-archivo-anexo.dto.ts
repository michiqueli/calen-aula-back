import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * DTO para actualizar el título de un archivo anexo.
 */
export class UpdateArchivoAnexoDto {
  @ApiProperty({
    description: 'Nuevo nombre del archivo',
    example: 'documento-actualizado.pdf',
  })
  @IsString()
  nombreArchivo!: string;
}
