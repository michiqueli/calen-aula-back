import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFilter } from './domain/entities/user-filter.entity.js';
import { USER_FILTERS_PORT } from './domain/ports/user-filters.port.js';
import { UserFiltersRepository } from './infrastructure/persistence/user-filters.repository.js';
import { UserFiltersService } from './application/services/user-filters.service.js';
import { UserFiltersController } from './infrastructure/controllers/user-filters.controller.js';

/**
 * Módulo de filtros de visualización de usuario.
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserFilter])],
  controllers: [UserFiltersController],
  providers: [
    UserFiltersService,
    {
      provide: USER_FILTERS_PORT,
      useClass: UserFiltersRepository,
    },
  ],
  exports: [UserFiltersService],
})
export class UserFiltersModule {}
