import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NivelEducativo } from '../../domain/entities/nivel-educativo.entity.js';
import { NivelesEducativosPort } from '../../domain/ports/niveles-educativos.port.js';

/**
 * Adaptador de persistencia para niveles educativos.
 * Implementa el puerto NivelesEducativosPort usando TypeORM.
 */
@Injectable()
export class NivelesEducativosRepository implements NivelesEducativosPort {
  constructor(
    @InjectRepository(NivelEducativo)
    private readonly repo: Repository<NivelEducativo>,
  ) {}

  async findAll(): Promise<NivelEducativo[]> {
    return this.repo.find({ order: { orden: 'ASC' } });
  }

  async findAllActive(): Promise<NivelEducativo[]> {
    return this.repo.find({ where: { activo: true }, order: { orden: 'ASC' } });
  }

  async findById(id: string): Promise<NivelEducativo | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<NivelEducativo>): Promise<NivelEducativo> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, data: Partial<NivelEducativo>): Promise<NivelEducativo> {
    await this.repo.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Nivel educativo con id ${id} no encontrado`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
