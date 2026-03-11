import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anexo } from './domain/entities/anexo.entity.js';
import { ANEXO_PORT } from './domain/ports/anexo.port.js';
import { AnexoRepository } from './infrastructure/persistence/anexo.repository.js';
import { AnexoService } from './application/services/anexo.service.js';
import { AnexoController } from './infrastructure/controllers/anexo.controller.js';

/**
 * Módulo de anexos.
 * Gestiona los anexos del calendario escolar.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Anexo])],
  controllers: [AnexoController],
  providers: [
    AnexoService,
    {
      provide: ANEXO_PORT,
      useClass: AnexoRepository,
    },
  ],
  exports: [AnexoService],
})
export class AnexoModule {}
