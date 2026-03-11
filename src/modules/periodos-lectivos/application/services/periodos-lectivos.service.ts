import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  PERIODOS_LECTIVOS_PORT,
  PeriodosLectivosPort,
} from '../../domain/ports/periodos-lectivos.port.js';
import { PeriodoLectivo } from '../../domain/entities/periodo-lectivo.entity.js';
import { CreatePeriodoLectivoDto } from '../dtos/create-periodo-lectivo.dto.js';

/**
 * Servicio de aplicación para periodos lectivos.
 */
@Injectable()
export class PeriodosLectivosService {
  constructor(
    @Inject(PERIODOS_LECTIVOS_PORT)
    private readonly port: PeriodosLectivosPort,
  ) {}

  async findAll(): Promise<PeriodoLectivo[]> {
    return this.port.findAll();
  }

  async create(dto: CreatePeriodoLectivoDto): Promise<PeriodoLectivo> {
    return this.port.create(dto);
  }

  async delete(id: string): Promise<void> {
    return this.port.delete(id);
  }
}
