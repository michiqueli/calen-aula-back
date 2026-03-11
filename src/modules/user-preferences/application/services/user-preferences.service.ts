import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  USER_PREFERENCES_PORT,
  UserPreferencesPort,
} from '../../domain/ports/user-preferences.port.js';
import { CreatePreferencesDto } from '../dtos/create-preferences.dto.js';
import { UpsertThemeDto } from '../dtos/upsert-theme.dto.js';
import { UserPreference } from '../../domain/entities/user-preference.entity.js';

/**
 * Servicio de aplicación para preferencias de usuario.
 */
@Injectable()
export class UserPreferencesService {
  constructor(
    @Inject(USER_PREFERENCES_PORT)
    private readonly userPreferencesPort: UserPreferencesPort,
  ) {}

  /**
   * Obtiene las preferencias de un usuario.
   */
  async getPreferences(userId: string): Promise<UserPreference> {
    const preferences = await this.userPreferencesPort.findByUserId(userId);
    if (!preferences) {
      throw new NotFoundException('Preferencias de usuario no encontradas');
    }
    return preferences;
  }

  /**
   * Crea las preferencias de un usuario.
   */
  async createPreferences(userId: string, dto: CreatePreferencesDto): Promise<UserPreference> {
    return this.userPreferencesPort.create({
      userId,
      themePreference: dto.themePreference ?? 'light',
    });
  }

  /**
   * Actualiza o crea la preferencia de tema.
   */
  async upsertTheme(userId: string, dto: UpsertThemeDto): Promise<UserPreference> {
    return this.userPreferencesPort.upsert(userId, {
      themePreference: dto.themePreference,
    });
  }
}
