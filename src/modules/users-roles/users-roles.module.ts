import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './domain/entities/user-role.entity.js';
import { USERS_ROLES_PORT } from './domain/ports/users-roles.port.js';
import { UsersRolesRepository } from './infrastructure/persistence/users-roles.repository.js';
import { UsersRolesService } from './application/services/users-roles.service.js';
import { UsersRolesController } from './infrastructure/controllers/users-roles.controller.js';

/**
 * Módulo de roles de usuario.
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserRole])],
  controllers: [UsersRolesController],
  providers: [
    UsersRolesService,
    {
      provide: USERS_ROLES_PORT,
      useClass: UsersRolesRepository,
    },
  ],
  exports: [UsersRolesService],
})
export class UsersRolesModule {}
