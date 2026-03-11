import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Archivo } from '../../domain/entities/archivo.entity.js';
import { ArchivosPort } from '../../domain/ports/archivos.port.js';

/**
 * Adaptador de persistencia para la entidad Archivo.
 */
@Injectable()
export class ArchivosRepository implements ArchivosPort {
  constructor(
    @InjectRepository(Archivo)
    private readonly repo: Repository<Archivo>,
  ) {}

  async findAllByUserId(userId: string): Promise<Archivo[]> {
    return this.repo.find({
      where: { uploadedBy: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Archivo | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(archivo: Partial<Archivo>): Promise<Archivo> {
    const entity = this.repo.create(archivo);
    return this.repo.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
