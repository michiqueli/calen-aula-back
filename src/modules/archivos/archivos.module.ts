import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Archivo } from './domain/entities/archivo.entity.js';
import { ARCHIVOS_PORT } from './domain/ports/archivos.port.js';
import { ArchivosRepository } from './infrastructure/persistence/archivos.repository.js';
import { ArchivosService } from './application/services/archivos.service.js';
import { ArchivosController } from './infrastructure/controllers/archivos.controller.js';

/**
 * Módulo de archivos (biblioteca global).
 */
@Module({
  imports: [TypeOrmModule.forFeature([Archivo])],
  controllers: [ArchivosController],
  providers: [
    ArchivosService,
    {
      provide: ARCHIVOS_PORT,
      useClass: ArchivosRepository,
    },
  ],
  exports: [ArchivosService],
})
export class ArchivosModule {}
