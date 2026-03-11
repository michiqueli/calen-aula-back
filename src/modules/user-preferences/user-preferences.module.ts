import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreference } from './domain/entities/user-preference.entity.js';
import { USER_PREFERENCES_PORT } from './domain/ports/user-preferences.port.js';
import { UserPreferencesRepository } from './infrastructure/persistence/user-preferences.repository.js';
import { UserPreferencesService } from './application/services/user-preferences.service.js';
import { UserPreferencesController } from './infrastructure/controllers/user-preferences.controller.js';

/**
 * Módulo de preferencias de usuario.
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserPreference])],
  controllers: [UserPreferencesController],
  providers: [
    UserPreferencesService,
    {
      provide: USER_PREFERENCES_PORT,
      useClass: UserPreferencesRepository,
    },
  ],
  exports: [UserPreferencesService],
})
export class UserPreferencesModule {}
