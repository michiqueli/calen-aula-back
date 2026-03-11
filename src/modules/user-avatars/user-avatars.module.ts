import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAvatar } from './domain/entities/user-avatar.entity.js';
import { USER_AVATARS_PORT } from './domain/ports/user-avatars.port.js';
import { UserAvatarsRepository } from './infrastructure/persistence/user-avatars.repository.js';
import { UserAvatarsService } from './application/services/user-avatars.service.js';
import { UserAvatarsController } from './infrastructure/controllers/user-avatars.controller.js';

/**
 * Módulo de avatares de usuario.
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserAvatar])],
  controllers: [UserAvatarsController],
  providers: [
    UserAvatarsService,
    {
      provide: USER_AVATARS_PORT,
      useClass: UserAvatarsRepository,
    },
  ],
  exports: [UserAvatarsService],
})
export class UserAvatarsModule {}
