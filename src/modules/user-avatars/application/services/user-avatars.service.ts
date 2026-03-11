import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { USER_AVATARS_PORT, UserAvatarsPort } from '../../domain/ports/user-avatars.port.js';
import { UpsertAvatarDto } from '../dtos/upsert-avatar.dto.js';
import { UserAvatar } from '../../domain/entities/user-avatar.entity.js';

/**
 * Servicio de aplicación para avatares de usuario.
 */
@Injectable()
export class UserAvatarsService {
  constructor(
    @Inject(USER_AVATARS_PORT)
    private readonly userAvatarsPort: UserAvatarsPort,
  ) {}

  /**
   * Obtiene el avatar de un usuario.
   */
  async getAvatar(userId: string): Promise<UserAvatar> {
    const avatar = await this.userAvatarsPort.findByUserId(userId);
    if (!avatar) {
      throw new NotFoundException('Avatar de usuario no encontrado');
    }
    return avatar;
  }

  /**
   * Crea o actualiza el avatar de un usuario.
   */
  async upsertAvatar(userId: string, dto: UpsertAvatarDto): Promise<UserAvatar> {
    return this.userAvatarsPort.upsert(userId, {
      avatarId: dto.avatarId,
      avatarName: dto.avatarName,
    });
  }
}
