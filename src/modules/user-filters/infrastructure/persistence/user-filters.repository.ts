import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFilter } from '../../domain/entities/user-filter.entity.js';
import { UserFiltersPort } from '../../domain/ports/user-filters.port.js';

/**
 * Adaptador de persistencia para la entidad UserFilter.
 */
@Injectable()
export class UserFiltersRepository implements UserFiltersPort {
  constructor(
    @InjectRepository(UserFilter)
    private readonly repo: Repository<UserFilter>,
  ) {}

  async findByUserId(userId: string): Promise<UserFilter | null> {
    return this.repo.findOne({ where: { userId } });
  }

  async upsert(userId: string, data: Partial<UserFilter>): Promise<UserFilter> {
    const existing = await this.findByUserId(userId);
    if (existing) {
      await this.repo.update(existing.id, data);
      const updated = await this.repo.findOne({ where: { id: existing.id } });
      if (!updated) {
        throw new Error(`Filtro con id ${existing.id} no encontrado`);
      }
      return updated;
    }
    const filter = this.repo.create({ userId, ...data });
    return this.repo.save(filter);
  }
}
