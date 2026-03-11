import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  RANGOS_LECTIVOS_PORT,
  RangosLectivosPort,
} from '../../domain/ports/rangos-lectivos.port.js';
import { RangoLectivo } from '../../domain/entities/rango-lectivo.entity.js';
import { CreateRangoLectivoDto } from '../dtos/create-rango-lectivo.dto.js';
import { UpdateRangoLectivoDto } from '../dtos/update-rango-lectivo.dto.js';

/**
 * Servicio de aplicación para rangos lectivos.
 */
@Injectable()
export class RangosLectivosService {
  constructor(
    @Inject(RANGOS_LECTIVOS_PORT)
    private readonly port: RangosLectivosPort,
  ) {}

  async findAll(): Promise<RangoLectivo[]> {
    return this.port.findAll();
  }

  async create(dto: CreateRangoLectivoDto): Promise<RangoLectivo> {
    return this.port.create(dto);
  }

  async update(id: string, dto: UpdateRangoLectivoDto): Promise<RangoLectivo> {
    return this.port.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    return this.port.delete(id);
  }
}
