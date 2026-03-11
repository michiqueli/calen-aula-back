import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersRolesService } from '../../application/services/users-roles.service.js';
import { UserRoleResponseDto } from '../../application/dtos/user-role-response.dto.js';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard.js';
import { CurrentUser, JwtPayload } from '../../../../common/decorators/current-user.decorator.js';

/**
 * Controlador de roles de usuario.
 */
@ApiTags('Users Roles')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('users-roles')
export class UsersRolesController {
  constructor(private readonly usersRolesService: UsersRolesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtener rol del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Rol del usuario', type: UserRoleResponseDto })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  async getMyRole(@CurrentUser() user: JwtPayload): Promise<UserRoleResponseDto> {
    return this.usersRolesService.getRole(user.sub);
  }
}
