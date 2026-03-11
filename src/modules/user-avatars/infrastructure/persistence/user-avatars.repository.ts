import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAvatar } from '../../domain/entities/user-avatar.entity.js';
import { UserAvatarsPort } from '../../domain/ports/user-avatars.port.js';

/**
 * Adaptador de persistencia para la entidad UserAvatar.
 */
@Injectable()
export class UserAvatarsRepository implements UserAvatarsPort {
  constructor(
    @InjectRepository(UserAvatar)
    private readonly repo: Repository<UserAvatar>,
  ) {}

  async findByUserId(userId: string): Promise<UserAvatar | null> {
    return this.repo.findOne({ where: { userId } });
  }

  async upsert(userId: string, data: Partial<UserAvatar>): Promise<UserAvatar> {
    const existing = await this.findByUserId(userId);
    if (existing) {
      await this.repo.update(existing.id, data);
      const updated = await this.repo.findOne({ where: { id: existing.id } });
      if (!updated) {
        throw new Error(`Avatar con id ${existing.id} no encontrado`);
      }
      return updated;
    }
    const avatar = this.repo.create({ userId, ...data });
    return this.repo.save(avatar);
  }
}
