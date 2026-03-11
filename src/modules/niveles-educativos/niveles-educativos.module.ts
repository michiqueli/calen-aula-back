import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NivelEducativo } from './domain/entities/nivel-educativo.entity.js';
import { NIVELES_EDUCATIVOS_PORT } from './domain/ports/niveles-educativos.port.js';
import { NivelesEducativosRepository } from './infrastructure/persistence/niveles-educativos.repository.js';
import { NivelesEducativosService } from './application/services/niveles-educativos.service.js';
import { NivelesEducativosController } from './infrastructure/controllers/niveles-educativos.controller.js';
import { NivelesEducativosGateway } from './infrastructure/gateways/niveles-educativos.gateway.js';

/**
 * Módulo de niveles educativos.
 * Provee CRUD y notificaciones WebSocket en tiempo real.
 */
@Module({
  imports: [TypeOrmModule.forFeature([NivelEducativo])],
  controllers: [NivelesEducativosController],
  providers: [
    NivelesEducativosService,
    NivelesEducativosGateway,
    {
      provide: NIVELES_EDUCATIVOS_PORT,
      useClass: NivelesEducativosRepository,
    },
  ],
  exports: [NivelesEducativosService, NivelesEducativosGateway],
})
export class NivelesEducativosModule {}
