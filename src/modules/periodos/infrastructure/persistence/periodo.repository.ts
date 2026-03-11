import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Periodo } from '../../domain/entities/periodo.entity.js';
import { PeriodoPort } from '../../domain/ports/periodo.port.js';

/**
 * Adaptador de persistencia para la entidad Periodo.
 * Implementa el puerto PeriodoPort usando TypeORM.
 */
@Injectable()
export class PeriodoRepository implements PeriodoPort {
  constructor(
    @InjectRepository(Periodo)
    private readonly repo: Repository<Periodo>,
  ) {}

  async findAllByUserId(userId: string): Promise<Periodo[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
  }

  async findByAnexoId(anexoId: string): Promise<Periodo[]> {
    return this.repo
      .createQueryBuilder('periodo')
      .innerJoin(
        'fechas_importantes_anexo',
        'fia',
        'fia.periodo_id = periodo.id',
      )
      .where('fia.anexo_id = :anexoId', { anexoId })
      .groupBy('periodo.id')
      .orderBy('periodo.created_at', 'ASC')
      .getMany();
  }

  async findByNombreAndUserId(nombre: string, userId: string): Promise<Periodo | null> {
    return this.repo.findOne({ where: { nombre, userId } });
  }

  async create(periodoData: Partial<Periodo>): Promise<Periodo> {
    const periodo = this.repo.create(periodoData);
    return this.repo.save(periodo);
  }

  async createBulk(periodos: Partial<Periodo>[]): Promise<Periodo[]> {
    const entities = this.repo.create(periodos);
    return this.repo.save(entities);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
