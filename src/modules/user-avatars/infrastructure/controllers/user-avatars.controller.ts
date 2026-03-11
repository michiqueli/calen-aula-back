import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserAvatarsService } from '../../application/services/user-avatars.service.js';
import { UpsertAvatarDto } from '../../application/dtos/upsert-avatar.dto.js';
import { UserAvatarResponseDto } from '../../application/dtos/user-avatar-response.dto.js';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard.js';
import { CurrentUser, JwtPayload } from '../../../../common/decorators/current-user.decorator.js';
import { UserAvatar } from '../../domain/entities/user-avatar.entity.js';

/**
 * Controlador de avatares de usuario.
 */
@ApiTags('User Avatars')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('user-avatars')
export class UserAvatarsController {
  constructor(private readonly userAvatarsService: UserAvatarsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener avatar del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Avatar del usuario', type: UserAvatarResponseDto })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Avatar no encontrado' })
  async getAvatar(@CurrentUser() user: JwtPayload): Promise<UserAvatar> {
    return this.userAvatarsService.getAvatar(user.sub);
  }

  @Put()
  @ApiOperation({ summary: 'Crear o actualizar avatar del usuario' })
  @ApiResponse({ status: 200, description: 'Avatar actualizado', type: UserAvatarResponseDto })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async upsertAvatar(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpsertAvatarDto,
  ): Promise<UserAvatar> {
    return this.userAvatarsService.upsertAvatar(user.sub, dto);
  }
}
