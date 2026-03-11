import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../domain/entities/user-role.entity.js';
import { UsersRolesPort } from '../../domain/ports/users-roles.port.js';

/**
 * Adaptador de persistencia para la entidad UserRole.
 */
@Injectable()
export class UsersRolesRepository implements UsersRolesPort {
  constructor(
    @InjectRepository(UserRole)
    private readonly repo: Repository<UserRole>,
  ) {}

  async findByUserId(userId: string): Promise<UserRole | null> {
    return this.repo.findOne({ where: { id: userId } });
  }
}
