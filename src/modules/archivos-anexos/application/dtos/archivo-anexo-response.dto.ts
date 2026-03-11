import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de respuesta para un archivo anexo.
 */
export class ArchivoAnexoResponseDto {
  @ApiProperty({ description: 'ID único del archivo anexo', example: 'uuid-v4' })
  id!: string;

  @ApiProperty({ description: 'ID del anexo al que pertenece', example: 'uuid-v4' })
  anexoId!: string;

  @ApiProperty({ description: 'ID del usuario propietario', example: 'uuid-v4' })
  userId!: string;

  @ApiProperty({ description: 'Nombre del archivo', example: 'documento.pdf' })
  nombreArchivo!: string;

  @ApiProperty({
    description: 'URL del archivo (legacy)',
    example: '',
  })
  archivoUrl!: string;

  @ApiProperty({
    description: 'Ruta del archivo en el bucket',
    example: 'userId/anexoId/1234567890_documento.pdf',
  })
  filePath!: string;

  @ApiProperty({
    description: 'Tipo MIME del archivo',
    example: 'application/pdf',
    nullable: true,
  })
  fileType!: string | null;

  @ApiProperty({
    description: 'Tamaño del archivo en bytes',
    example: 1024,
    nullable: true,
  })
  fileSize!: number | null;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt!: Date;
}
