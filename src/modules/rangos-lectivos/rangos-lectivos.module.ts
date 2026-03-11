import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RangoLectivo } from './domain/entities/rango-lectivo.entity.js';
import { RANGOS_LECTIVOS_PORT } from './domain/ports/rangos-lectivos.port.js';
import { RangosLectivosRepository } from './infrastructure/persistence/rangos-lectivos.repository.js';
import { RangosLectivosService } from './application/services/rangos-lectivos.service.js';
import { RangosLectivosController } from './infrastructure/controllers/rangos-lectivos.controller.js';

/**
 * Módulo de rangos lectivos.
 */
@Module({
  imports: [TypeOrmModule.forFeature([RangoLectivo])],
  controllers: [RangosLectivosController],
  providers: [
    RangosLectivosService,
    {
      provide: RANGOS_LECTIVOS_PORT,
      useClass: RangosLectivosRepository,
    },
  ],
  exports: [RangosLectivosService],
})
export class RangosLectivosModule {}
