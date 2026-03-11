import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { USERS_ROLES_PORT, UsersRolesPort } from '../../domain/ports/users-roles.port.js';
import { UserRoleResponseDto } from '../dtos/user-role-response.dto.js';

/**
 * Servicio de aplicación para roles de usuario.
 */
@Injectable()
export class UsersRolesService {
  constructor(
    @Inject(USERS_ROLES_PORT)
    private readonly usersRolesPort: UsersRolesPort,
  ) {}

  /**
   * Obtiene el rol de un usuario por su ID.
   */
  async getRole(userId: string): Promise<UserRoleResponseDto> {
    const userRole = await this.usersRolesPort.findByUserId(userId);
    if (!userRole) {
      // Return default 'user' role when no explicit role is assigned
      return {
        id: userId,
        rol: 'user',
      };
    }
    return {
      id: userRole.id,
      rol: userRole.rol,
    };
  }
}
