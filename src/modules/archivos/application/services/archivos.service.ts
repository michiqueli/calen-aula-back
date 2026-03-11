import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { ARCHIVOS_PORT, ArchivosPort } from '../../domain/ports/archivos.port.js';
import {
  StoragePort,
  STORAGE_PORT,
} from '../../../storage/domain/ports/storage.port.js';
import { UploadArchivoDto } from '../dtos/upload-archivo.dto.js';
import { ArchivoResponseDto } from '../dtos/archivo-response.dto.js';

/**
 * Servicio de aplicación para gestión de archivos.
 */
@Injectable()
export class ArchivosService {
  constructor(
    @Inject(ARCHIVOS_PORT)
    private readonly archivosPort: ArchivosPort,
    @Inject(STORAGE_PORT)
    private readonly storagePort: StoragePort,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Lista todos los archivos de un usuario ordenados por fecha de creación DESC.
   */
  async findAll(userId: string): Promise<ArchivoResponseDto[]> {
    const archivos = await this.archivosPort.findAllByUserId(userId);
    return archivos.map((a) => this.toResponseDto(a));
  }

  /**
   * Sube un archivo al almacenamiento y guarda los metadatos en la base de datos.
   */
  async upload(
    userId: string,
    file: Express.Multer.File,
    dto: UploadArchivoDto,
  ): Promise<ArchivoResponseDto> {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    const bucket = this.configService.get<string>('s3.bucketFiles', 'files');
    const ext = extname(file.originalname);
    const storagePath = `${userId}/${randomUUID()}${ext}`;

    await this.storagePort.upload(
      bucket,
      storagePath,
      file.buffer,
      file.mimetype,
    );

    const archivo = await this.archivosPort.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion ?? null,
      storageBucket: bucket,
      storagePath,
      mimeType: file.mimetype,
      fileSizeBytes: file.size,
      uploadedBy: userId,
    });

    return this.toResponseDto(archivo);
  }

  /**
   * Elimina un archivo del almacenamiento y de la base de datos.
   */
  async delete(id: string): Promise<void> {
    const archivo = await this.archivosPort.findById(id);
    if (!archivo) {
      throw new NotFoundException('Archivo no encontrado');
    }

    await this.storagePort.delete(archivo.storageBucket, archivo.storagePath);
    await this.archivosPort.delete(id);
  }

  /**
   * Genera una URL firmada para previsualizar un archivo.
   */
  async getSignedUrl(
    id: string,
    expiresIn: number = 3600,
  ): Promise<{ url: string }> {
    const archivo = await this.archivosPort.findById(id);
    if (!archivo) {
      throw new NotFoundException('Archivo no encontrado');
    }

    const url = await this.storagePort.getSignedUrl(
      archivo.storageBucket,
      archivo.storagePath,
      expiresIn,
    );
    return { url };
  }

  /**
   * Genera una URL firmada para descarga directa con expiración de 60 segundos.
   */
  async download(id: string): Promise<{ url: string }> {
    const archivo = await this.archivosPort.findById(id);
    if (!archivo) {
      throw new NotFoundException('Archivo no encontrado');
    }

    const url = await this.storagePort.getSignedUrl(
      archivo.storageBucket,
      archivo.storagePath,
      60,
    );
    return { url };
  }

  private toResponseDto(archivo: {
    id: string;
    titulo: string;
    descripcion: string | null;
    storageBucket: string;
    storagePath: string;
    mimeType: string | null;
    fileSizeBytes: number;
    uploadedBy: string;
    createdAt: Date;
  }): ArchivoResponseDto {
    return {
      id: archivo.id,
      titulo: archivo.titulo,
      descripcion: archivo.descripcion,
      storageBucket: archivo.storageBucket,
      storagePath: archivo.storagePath,
      mimeType: archivo.mimeType,
      fileSizeBytes: archivo.fileSizeBytes,
      uploadedBy: archivo.uploadedBy,
      createdAt: archivo.createdAt,
    };
  }
}
