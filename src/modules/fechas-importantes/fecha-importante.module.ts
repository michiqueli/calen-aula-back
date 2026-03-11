import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FechaImportanteAnexo } from './domain/entities/fecha-importante-anexo.entity.js';
import { FECHA_IMPORTANTE_PORT } from './domain/ports/fecha-importante.port.js';
import { FechaImportanteRepository } from './infrastructure/persistence/fecha-importante.repository.js';
import { FechaImportanteService } from './application/services/fecha-importante.service.js';
import { FechaImportanteController } from './infrastructure/controllers/fecha-importante.controller.js';
import { PeriodoModule } from '../periodos/periodo.module.js';

/**
 * Módulo de fechas importantes.
 * Gestiona las fechas importantes asociadas a los anexos.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([FechaImportanteAnexo]),
    forwardRef(() => PeriodoModule),
  ],
  controllers: [FechaImportanteController],
  providers: [
    FechaImportanteService,
    {
      provide: FECHA_IMPORTANTE_PORT,
      useClass: FechaImportanteRepository,
    },
  ],
  exports: [FechaImportanteService],
})
export class FechaImportanteModule {}
