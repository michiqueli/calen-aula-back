import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de respuesta para un archivo.
 */
export class ArchivoResponseDto {
  @ApiProperty({ description: 'ID único del archivo', example: 'uuid-v4' })
  id!: string;

  @ApiProperty({ description: 'Título del archivo', example: 'Mi documento' })
  titulo!: string;

  @ApiProperty({
    description: 'Descripción del archivo',
    example: 'Descripción opcional',
    nullable: true,
  })
  descripcion!: string | null;

  @ApiProperty({
    description: 'Bucket de almacenamiento',
    example: 'files',
  })
  storageBucket!: string;

  @ApiProperty({
    description: 'Ruta del archivo en el bucket',
    example: 'userId/uuid.pdf',
  })
  storagePath!: string;

  @ApiProperty({
    description: 'Tipo MIME del archivo',
    example: 'application/pdf',
    nullable: true,
  })
  mimeType!: string | null;

  @ApiProperty({ description: 'Tamaño del archivo en bytes', example: 1024 })
  fileSizeBytes!: number;

  @ApiProperty({
    description: 'ID del usuario que subió el archivo',
    example: 'uuid-v4',
  })
  uploadedBy!: string;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt!: Date;
}
