import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity.js';
import { AuthPort } from '../../domain/ports/auth.port.js';

/**
 * Adaptador de persistencia para la entidad User.
 * Implementa el puerto AuthPort usando TypeORM.
 */
@Injectable()
export class UserRepository implements AuthPort {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repo.create(userData);
    return this.repo.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.repo.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Usuario con id ${id} no encontrado`);
    }
    return updated;
  }
}
