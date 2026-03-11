import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchivoAnexo } from './domain/entities/archivo-anexo.entity.js';
import { ARCHIVOS_ANEXOS_PORT } from './domain/ports/archivos-anexos.port.js';
import { ArchivosAnexosRepository } from './infrastructure/persistence/archivos-anexos.repository.js';
import { ArchivosAnexosService } from './application/services/archivos-anexos.service.js';
import { ArchivosAnexosController } from './infrastructure/controllers/archivos-anexos.controller.js';

/**
 * Módulo de archivos de anexos.
 * Gestiona archivos adjuntos a anexos específicos con storage S3.
 */
@Module({
  imports: [TypeOrmModule.forFeature([ArchivoAnexo])],
  controllers: [ArchivosAnexosController],
  providers: [
    ArchivosAnexosService,
    {
      provide: ARCHIVOS_ANEXOS_PORT,
      useClass: ArchivosAnexosRepository,
    },
  ],
  exports: [ArchivosAnexosService, ARCHIVOS_ANEXOS_PORT],
})
export class ArchivosAnexosModule {}
