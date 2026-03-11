import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidad de dominio que representa un archivo en la biblioteca global.
 */
@Entity('archivos')
export class Archivo {
  @ApiProperty({ description: 'ID único del archivo', example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Título del archivo', example: 'Mi documento' })
  @Column({ type: 'text' })
  titulo!: string;

  @ApiProperty({
    description: 'Descripción del archivo',
    example: 'Descripción opcional',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @ApiProperty({
    description: 'Bucket de almacenamiento',
    example: 'files',
    default: 'files',
  })
  @Column({ type: 'text', default: 'files', name: 'storage_bucket' })
  storageBucket!: string;

  @ApiProperty({
    description: 'Ruta del archivo en el bucket',
    example: 'userId/uuid.pdf',
  })
  @Column({ type: 'text', name: 'storage_path' })
  storagePath!: string;

  @ApiProperty({
    description: 'Tipo MIME del archivo',
    example: 'application/pdf',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true, name: 'mime_type' })
  mimeType!: string | null;

  @ApiProperty({ description: 'Tamaño del archivo en bytes', example: 1024 })
  @Column({ type: 'bigint', name: 'file_size_bytes' })
  fileSizeBytes!: number;

  @ApiProperty({
    description: 'ID del usuario que subió el archivo',
    example: 'uuid-v4',
  })
  @Column({ type: 'uuid', name: 'uploaded_by' })
  uploadedBy!: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}
