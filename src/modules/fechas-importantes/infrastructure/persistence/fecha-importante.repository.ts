import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FechaImportanteAnexo } from '../../domain/entities/fecha-importante-anexo.entity.js';
import { FechaImportantePort } from '../../domain/ports/fecha-importante.port.js';

/**
 * Adaptador de persistencia para la entidad FechaImportanteAnexo.
 * Implementa el puerto FechaImportantePort usando TypeORM.
 */
@Injectable()
export class FechaImportanteRepository implements FechaImportantePort {
  constructor(
    @InjectRepository(FechaImportanteAnexo)
    private readonly repo: Repository<FechaImportanteAnexo>,
  ) {}

  async findByAnexoId(anexoId: string): Promise<FechaImportanteAnexo[]> {
    return this.repo.find({
      where: { anexoId },
      relations: ['periodo'],
      order: { fechaInicio: 'ASC' },
    });
  }

  async create(fecha: Partial<FechaImportanteAnexo>): Promise<FechaImportanteAnexo> {
    const entity = this.repo.create(fecha);
    return this.repo.save(entity);
  }

  async createBulk(fechas: Partial<FechaImportanteAnexo>[]): Promise<FechaImportanteAnexo[]> {
    const entities = this.repo.create(fechas);
    return this.repo.save(entities);
  }

  async update(id: string, data: Partial<FechaImportanteAnexo>): Promise<FechaImportanteAnexo> {
    await this.repo.update(id, data);
    const updated = await this.repo.findOne({ where: { id }, relations: ['periodo'] });
    if (!updated) {
      throw new Error(`FechaImportanteAnexo con id ${id} no encontrada`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async countByPeriodoId(periodoId: string): Promise<number> {
    return this.repo.count({ where: { periodoId } });
  }
}
