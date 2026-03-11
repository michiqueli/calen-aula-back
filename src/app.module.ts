import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';

// Configuración
import databaseConfig from './config/database.config.js';
import jwtConfig from './config/jwt.config.js';
import s3Config from './config/s3.config.js';

// Filtros globales
import { GlobalExceptionFilter } from './common/filters/http-exception.filter.js';

// Módulos
import { StorageModule } from './modules/storage/storage.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersRolesModule } from './modules/users-roles/users-roles.module.js';
import { UserPreferencesModule } from './modules/user-preferences/user-preferences.module.js';
import { UserAvatarsModule } from './modules/user-avatars/user-avatars.module.js';
import { UserFiltersModule } from './modules/user-filters/user-filters.module.js';
import { NivelesEducativosModule } from './modules/niveles-educativos/niveles-educativos.module.js';
import { PeriodosLectivosModule } from './modules/periodos-lectivos/periodos-lectivos.module.js';
import { RangosLectivosModule } from './modules/rangos-lectivos/rangos-lectivos.module.js';
import { AnexoModule } from './modules/anexos/anexo.module.js';
import { FechaImportanteModule } from './modules/fechas-importantes/fecha-importante.module.js';
import { PeriodoModule } from './modules/periodos/periodo.module.js';
import { ArchivosModule } from './modules/archivos/archivos.module.js';
import { ArchivosAnexosModule } from './modules/archivos-anexos/archivos-anexos.module.js';

/**
 * Módulo raíz de la aplicación CalenAula.
 * Configura la conexión a base de datos, módulos de feature y filtros globales.
 */
@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, s3Config],
    }),

    // Base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),

    // Módulos de infraestructura
    StorageModule,

    // Módulos de feature
    AuthModule,
    UsersRolesModule,
    UserPreferencesModule,
    UserAvatarsModule,
    UserFiltersModule,
    NivelesEducativosModule,
    PeriodosLectivosModule,
    RangosLectivosModule,
    AnexoModule,
    FechaImportanteModule,
    PeriodoModule,
    ArchivosModule,
    ArchivosAnexosModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
