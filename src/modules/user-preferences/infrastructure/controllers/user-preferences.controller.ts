import { Controller, Get, Post, Put, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserPreferencesService } from '../../application/services/user-preferences.service.js';
import { CreatePreferencesDto } from '../../application/dtos/create-preferences.dto.js';
import { UpsertThemeDto } from '../../application/dtos/upsert-theme.dto.js';
import { UserPreferenceResponseDto } from '../../application/dtos/user-preference-response.dto.js';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard.js';
import { CurrentUser, JwtPayload } from '../../../../common/decorators/current-user.decorator.js';
import { UserPreference } from '../../domain/entities/user-preference.entity.js';

/**
 * Controlador de preferencias de usuario.
 */
@ApiTags('User Preferences')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('user-preferences')
export class UserPreferencesController {
  constructor(private readonly userPreferencesService: UserPreferencesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener preferencias del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Preferencias del usuario', type: UserPreferenceResponseDto })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Preferencias no encontradas' })
  async getPreferences(@CurrentUser() user: JwtPayload): Promise<UserPreference> {
    return this.userPreferencesService.getPreferences(user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Crear preferencias del usuario' })
  @ApiResponse({ status: 201, description: 'Preferencias creadas', type: UserPreferenceResponseDto })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async createPreferences(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreatePreferencesDto,
  ): Promise<UserPreference> {
    return this.userPreferencesService.createPreferences(user.sub, dto);
  }

  @Put('theme')
  @ApiOperation({ summary: 'Actualizar preferencia de tema' })
  @ApiResponse({ status: 200, description: 'Tema actualizado', type: UserPreferenceResponseDto })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async upsertTheme(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpsertThemeDto,
  ): Promise<UserPreference> {
    return this.userPreferencesService.upsertTheme(user.sub, dto);
  }
}
