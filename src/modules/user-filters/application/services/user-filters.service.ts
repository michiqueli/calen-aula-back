import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { USER_FILTERS_PORT, UserFiltersPort } from '../../domain/ports/user-filters.port.js';
import { SyncFiltersDto } from '../dtos/sync-filters.dto.js';
import { UserFilter } from '../../domain/entities/user-filter.entity.js';

/**
 * Servicio de aplicación para filtros de visualización de usuario.
 */
@Injectable()
export class UserFiltersService {
  constructor(
    @Inject(USER_FILTERS_PORT)
    private readonly userFiltersPort: UserFiltersPort,
  ) {}

  /**
   * Obtiene los filtros de visualización de un usuario.
   */
  async getFilters(userId: string): Promise<UserFilter> {
    const filters = await this.userFiltersPort.findByUserId(userId);
    if (!filters) {
      throw new NotFoundException('Filtros de usuario no encontrados');
    }
    return filters;
  }

  /**
   * Sincroniza (upsert) los filtros de visualización de un usuario.
   * Reemplaza la edge function anterior.
   */
  async syncFilters(userId: string, dto: SyncFiltersDto): Promise<UserFilter> {
    return this.userFiltersPort.upsert(userId, {
      rangoLectivoFilters: dto.filters,
    });
  }
}
