import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArchivoAnexo } from '../../domain/entities/archivo-anexo.entity.js';
import { ArchivosAnexosPort } from '../../domain/ports/archivos-anexos.port.js';

/**
 * Adaptador de persistencia para la entidad ArchivoAnexo.
 */
@Injectable()
export class ArchivosAnexosRepository implements ArchivosAnexosPort {
  constructor(
    @InjectRepository(ArchivoAnexo)
    private readonly repo: Repository<ArchivoAnexo>,
  ) {}

  async findByAnexoId(
    anexoId: string,
    userId: string,
  ): Promise<ArchivoAnexo[]> {
    return this.repo.find({
      where: { anexoId, userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByUserId(userId: string): Promise<ArchivoAnexo[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<ArchivoAnexo | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(archivoAnexo: Partial<ArchivoAnexo>): Promise<ArchivoAnexo> {
    const entity = this.repo.create(archivoAnexo);
    return this.repo.save(entity);
  }

  async updateTitle(id: string, nombreArchivo: string): Promise<void> {
    await this.repo.update(id, { nombreArchivo });
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
