import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RangoLectivo } from '../../domain/entities/rango-lectivo.entity.js';
import { RangosLectivosPort } from '../../domain/ports/rangos-lectivos.port.js';

/**
 * Adaptador de persistencia para rangos lectivos.
 * Implementa el puerto RangosLectivosPort usando TypeORM.
 */
@Injectable()
export class RangosLectivosRepository implements RangosLectivosPort {
  constructor(
    @InjectRepository(RangoLectivo)
    private readonly repo: Repository<RangoLectivo>,
  ) {}

  async findAll(): Promise<RangoLectivo[]> {
    return this.repo.find({ order: { fechaInicio: 'ASC' } });
  }

  async create(data: Partial<RangoLectivo>): Promise<RangoLectivo> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, data: Partial<RangoLectivo>): Promise<RangoLectivo> {
    await this.repo.update(id, data);
    const updated = await this.repo.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException(`Rango lectivo con id ${id} no encontrado`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
