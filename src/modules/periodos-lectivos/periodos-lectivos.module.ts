import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodoLectivo } from './domain/entities/periodo-lectivo.entity.js';
import { PERIODOS_LECTIVOS_PORT } from './domain/ports/periodos-lectivos.port.js';
import { PeriodosLectivosRepository } from './infrastructure/persistence/periodos-lectivos.repository.js';
import { PeriodosLectivosService } from './application/services/periodos-lectivos.service.js';
import { PeriodosLectivosController } from './infrastructure/controllers/periodos-lectivos.controller.js';

/**
 * Módulo de periodos lectivos.
 */
@Module({
  imports: [TypeOrmModule.forFeature([PeriodoLectivo])],
  controllers: [PeriodosLectivosController],
  providers: [
    PeriodosLectivosService,
    {
      provide: PERIODOS_LECTIVOS_PORT,
      useClass: PeriodosLectivosRepository,
    },
  ],
  exports: [PeriodosLectivosService],
})
export class PeriodosLectivosModule {}
