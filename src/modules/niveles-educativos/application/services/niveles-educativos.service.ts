import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  NIVELES_EDUCATIVOS_PORT,
  NivelesEducativosPort,
} from '../../domain/ports/niveles-educativos.port.js';
import { NivelEducativo } from '../../domain/entities/nivel-educativo.entity.js';
import { CreateNivelEducativoDto } from '../dtos/create-nivel-educativo.dto.js';
import { UpdateNivelEducativoDto } from '../dtos/update-nivel-educativo.dto.js';
import { NivelesEducativosGateway } from '../../infrastructure/gateways/niveles-educativos.gateway.js';

/**
 * Servicio de aplicación para niveles educativos.
 * Orquesta operaciones CRUD y emite eventos WebSocket.
 */
@Injectable()
export class NivelesEducativosService {
  constructor(
    @Inject(NIVELES_EDUCATIVOS_PORT)
    private readonly port: NivelesEducativosPort,
    private readonly gateway: NivelesEducativosGateway,
  ) {}

  async findAll(): Promise<NivelEducativo[]> {
    return this.port.findAll();
  }

  async findAllActive(): Promise<NivelEducativo[]> {
    return this.port.findAllActive();
  }

  async findById(id: string): Promise<NivelEducativo> {
    const entity = await this.port.findById(id);
    if (!entity) {
      throw new NotFoundException(`Nivel educativo con id ${id} no encontrado`);
    }
    return entity;
  }

  async create(dto: CreateNivelEducativoDto): Promise<NivelEducativo> {
    const created = await this.port.create(dto);
    this.gateway.broadcastChange('INSERT', created);
    return created;
  }

  async update(id: string, dto: UpdateNivelEducativoDto): Promise<NivelEducativo> {
    await this.findById(id);
    const updated = await this.port.update(id, dto);
    this.gateway.broadcastChange('UPDATE', updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.port.delete(id);
    this.gateway.broadcastChange('DELETE', { id });
  }
}
