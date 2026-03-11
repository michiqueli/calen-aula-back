import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidad de dominio que representa un archivo adjunto a un anexo.
 */
@Entity('archivos_anexos')
export class ArchivoAnexo {
  @ApiProperty({ description: 'ID único del archivo anexo', example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'ID del anexo al que pertenece', example: 'uuid-v4' })
  @Column({ type: 'uuid', name: 'anexo_id' })
  anexoId!: string;

  @ApiProperty({ description: 'ID del usuario propietario', example: 'uuid-v4' })
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @ApiProperty({ description: 'Nombre del archivo', example: 'documento.pdf' })
  @Column({ type: 'text', name: 'nombre_archivo' })
  nombreArchivo!: string;

  @ApiProperty({
    description: 'URL del archivo (legacy)',
    example: '',
    default: '',
  })
  @Column({ type: 'text', name: 'archivo_url', default: '' })
  archivoUrl!: string;

  @ApiProperty({
    description: 'Ruta del archivo en el bucket',
    example: 'userId/anexoId/1234567890_documento.pdf',
  })
  @Column({ type: 'text', name: 'file_path' })
  filePath!: string;

  @ApiProperty({
    description: 'Tipo MIME del archivo',
    example: 'application/pdf',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true, name: 'file_type' })
  fileType!: string | null;

  @ApiProperty({
    description: 'Tamaño del archivo en bytes',
    example: 1024,
    nullable: true,
  })
  @Column({ type: 'integer', nullable: true, name: 'file_size' })
  fileSize!: number | null;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}
