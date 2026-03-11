import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ARCHIVOS_ANEXOS_PORT,
  ArchivosAnexosPort,
} from '../../domain/ports/archivos-anexos.port.js';
import {
  StoragePort,
  STORAGE_PORT,
} from '../../../storage/domain/ports/storage.port.js';
import { ArchivoAnexoResponseDto } from '../dtos/archivo-anexo-response.dto.js';
import { ArchivoAnexo } from '../../domain/entities/archivo-anexo.entity.js';

/**
 * Servicio de aplicación para gestión de archivos de anexos.
 * Orquesta operaciones de storage y persistencia.
 */
@Injectable()
export class ArchivosAnexosService {
  private readonly bucket: string;

  constructor(
    @Inject(ARCHIVOS_ANEXOS_PORT)
    private readonly archivosAnexosPort: ArchivosAnexosPort,
    @Inject(STORAGE_PORT)
    private readonly storagePort: StoragePort,
    private readonly configService: ConfigService,
  ) {
    this.bucket = this.configService.get<string>(
      's3.bucketAnexoFiles',
      'anexo-files',
    );
  }

  /**
   * Obtiene archivos por anexo y usuario, ordenados por fecha de creación DESC.
   */
  async findByAnexoId(
    anexoId: string,
    userId: string,
  ): Promise<ArchivoAnexoResponseDto[]> {
    const archivos = await this.archivosAnexosPort.findByAnexoId(
      anexoId,
      userId,
    );
    return archivos.map((a) => this.toResponseDto(a));
  }

  /**
   * Obtiene todos los archivos de un usuario, ordenados por fecha de creación DESC.
   */
  async findAll(userId: string): Promise<ArchivoAnexoResponseDto[]> {
    const archivos = await this.archivosAnexosPort.findAllByUserId(userId);
    return archivos.map((a) => this.toResponseDto(a));
  }

  /**
   * Sube un archivo asociado a un anexo.
   */
  async upload(
    userId: string,
    anexoId: string,
    file: Express.Multer.File,
  ): Promise<ArchivoAnexoResponseDto> {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const timestamp = Date.now();
    const filePath = `${userId}/${anexoId}/${timestamp}_${sanitizedName}`;

    await this.storagePort.upload(
      this.bucket,
      filePath,
      file.buffer,
      file.mimetype,
    );

    const archivoAnexo = await this.archivosAnexosPort.create({
      anexoId,
      userId,
      nombreArchivo: file.originalname,
      archivoUrl: '',
      filePath,
      fileType: file.mimetype,
      fileSize: file.size,
    });

    return this.toResponseDto(archivoAnexo);
  }

  /**
   * Actualiza el título de un archivo.
   */
  async updateTitle(fileId: string, nombreArchivo: string): Promise<void> {
    const existing = await this.archivosAnexosPort.findById(fileId);
    if (!existing) {
      throw new NotFoundException('Archivo no encontrado');
    }
    await this.archivosAnexosPort.updateTitle(fileId, nombreArchivo);
  }

  /**
   * Genera una URL firmada temporal para acceder al archivo.
   */
  async getSignedUrl(
    fileId: string,
    expiresIn: number = 3600,
  ): Promise<{ url: string }> {
    const archivo = await this.archivosAnexosPort.findById(fileId);
    if (!archivo) {
      throw new NotFoundException('Archivo no encontrado');
    }
    const url = await this.storagePort.getSignedUrl(
      this.bucket,
      archivo.filePath,
      expiresIn,
    );
    return { url };
  }

  /**
   * Elimina un archivo del storage y la base de datos.
   */
  async delete(fileId: string): Promise<void> {
    const archivo = await this.archivosAnexosPort.findById(fileId);
    if (!archivo) {
      throw new NotFoundException('Archivo no encontrado');
    }

    await this.storagePort.delete(this.bucket, archivo.filePath);
    await this.archivosAnexosPort.delete(fileId);
  }

  private toResponseDto(archivo: ArchivoAnexo): ArchivoAnexoResponseDto {
    return {
      id: archivo.id,
      anexoId: archivo.anexoId,
      userId: archivo.userId,
      nombreArchivo: archivo.nombreArchivo,
      archivoUrl: archivo.archivoUrl,
      filePath: archivo.filePath,
      fileType: archivo.fileType,
      fileSize: archivo.fileSize,
      createdAt: archivo.createdAt,
    };
  }
}
