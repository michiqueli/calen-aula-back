import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreference } from '../../domain/entities/user-preference.entity.js';
import { UserPreferencesPort } from '../../domain/ports/user-preferences.port.js';

/**
 * Adaptador de persistencia para la entidad UserPreference.
 */
@Injectable()
export class UserPreferencesRepository implements UserPreferencesPort {
  constructor(
    @InjectRepository(UserPreference)
    private readonly repo: Repository<UserPreference>,
  ) {}

  async findByUserId(userId: string): Promise<UserPreference | null> {
    return this.repo.findOne({ where: { userId } });
  }

  async create(data: Partial<UserPreference>): Promise<UserPreference> {
    const preference = this.repo.create(data);
    return this.repo.save(preference);
  }

  async upsert(userId: string, data: Partial<UserPreference>): Promise<UserPreference> {
    const existing = await this.findByUserId(userId);
    if (existing) {
      await this.repo.update(existing.id, data);
      const updated = await this.repo.findOne({ where: { id: existing.id } });
      if (!updated) {
        throw new Error(`Preferencia con id ${existing.id} no encontrada`);
      }
      return updated;
    }
    return this.create({ userId, ...data });
  }
}
