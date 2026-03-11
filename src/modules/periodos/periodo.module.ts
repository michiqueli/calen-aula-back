import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Periodo } from './domain/entities/periodo.entity.js';
import { PERIODO_PORT } from './domain/ports/periodo.port.js';
import { PeriodoRepository } from './infrastructure/persistence/periodo.repository.js';
import { PeriodoService } from './application/services/periodo.service.js';
import { PeriodoController } from './infrastructure/controllers/periodo.controller.js';

/**
 * Módulo de periodos.
 * Gestiona los periodos del usuario.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Periodo])],
  controllers: [PeriodoController],
  providers: [
    PeriodoService,
    {
      provide: PERIODO_PORT,
      useClass: PeriodoRepository,
    },
  ],
  exports: [PeriodoService, PERIODO_PORT],
})
export class PeriodoModule {}
