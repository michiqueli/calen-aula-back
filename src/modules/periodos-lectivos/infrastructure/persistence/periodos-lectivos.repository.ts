import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeriodoLectivo } from '../../domain/entities/periodo-lectivo.entity.js';
import { PeriodosLectivosPort } from '../../domain/ports/periodos-lectivos.port.js';

/**
 * Adaptador de persistencia para periodos lectivos.
 * Implementa el puerto PeriodosLectivosPort usando TypeORM.
 */
@Injectable()
export class PeriodosLectivosRepository implements PeriodosLectivosPort {
  constructor(
    @InjectRepository(PeriodoLectivo)
    private readonly repo: Repository<PeriodoLectivo>,
  ) {}

  async findAll(): Promise<PeriodoLectivo[]> {
    return this.repo.find({ order: { ciclo: 'DESC' } });
  }

  async create(data: Partial<PeriodoLectivo>): Promise<PeriodoLectivo> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
