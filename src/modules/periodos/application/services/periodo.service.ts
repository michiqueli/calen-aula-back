import { Injectable, Inject } from '@nestjs/common';
import { PERIODO_PORT, PeriodoPort } from '../../domain/ports/periodo.port.js';
import { CreatePeriodoDto } from '../dtos/create-periodo.dto.js';
import { Periodo } from '../../domain/entities/periodo.entity.js';

/**
 * Servicio de aplicación para gestión de periodos.
 */
@Injectable()
export class PeriodoService {
  constructor(
    @Inject(PERIODO_PORT)
    private readonly periodoPort: PeriodoPort,
  ) {}

  /**
   * Obtiene todos los periodos del usuario ordenados por fecha de creación.
   */
  async findAll(userId: string): Promise<Periodo[]> {
    return this.periodoPort.findAllByUserId(userId);
  }

  /**
   * Obtiene los periodos que tienen fechas importantes en un anexo determinado.
   */
  async findByAnexoId(anexoId: string): Promise<Periodo[]> {
    return this.periodoPort.findByAnexoId(anexoId);
  }

  /**
   * Crea un nuevo periodo para el usuario.
   */
  async create(userId: string, dto: CreatePeriodoDto): Promise<Periodo> {
    return this.periodoPort.create({
      nombre: dto.nombre,
      userId,
    });
  }

  /**
   * Elimina un periodo por su ID.
   */
  async delete(periodoId: string): Promise<void> {
    return this.periodoPort.delete(periodoId);
  }
}
