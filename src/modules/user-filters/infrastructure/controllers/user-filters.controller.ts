import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserFiltersService } from '../../application/services/user-filters.service.js';
import { SyncFiltersDto } from '../../application/dtos/sync-filters.dto.js';
import { UserFilterResponseDto } from '../../application/dtos/user-filter-response.dto.js';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard.js';
import { CurrentUser, JwtPayload } from '../../../../common/decorators/current-user.decorator.js';
import { UserFilter } from '../../domain/entities/user-filter.entity.js';

/**
 * Controlador de filtros de visualización de usuario.
 */
@ApiTags('User Filters')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('user-filters')
export class UserFiltersController {
  constructor(private readonly userFiltersService: UserFiltersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener filtros del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Filtros del usuario', type: UserFilterResponseDto })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Filtros no encontrados' })
  async getFilters(@CurrentUser() user: JwtPayload): Promise<UserFilter> {
    return this.userFiltersService.getFilters(user.sub);
  }

  @Put('sync')
  @ApiOperation({ summary: 'Sincronizar filtros de visualización (reemplaza edge function)' })
  @ApiResponse({ status: 200, description: 'Filtros sincronizados', type: UserFilterResponseDto })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async syncFilters(
    @CurrentUser() user: JwtPayload,
    @Body() dto: SyncFiltersDto,
  ): Promise<UserFilter> {
    return this.userFiltersService.syncFilters(user.sub, dto);
  }
}
