import {
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import {
  FECHA_IMPORTANTE_PORT,
  FechaImportantePort,
} from '../../domain/ports/fecha-importante.port.js';
import { CreateFechaImportanteDto } from '../dtos/create-fecha-importante.dto.js';
import { UpdateFechaImportanteDto } from '../dtos/update-fecha-importante.dto.js';
import { BulkImportFechaDto } from '../dtos/bulk-import-fecha.dto.js';
import { FechaImportanteAnexo } from '../../domain/entities/fecha-importante-anexo.entity.js';
import { PERIODO_PORT, PeriodoPort } from '../../../periodos/domain/ports/periodo.port.js';

/**
 * Servicio de aplicación para gestión de fechas importantes de anexos.
 */
@Injectable()
export class FechaImportanteService {
  constructor(
    @Inject(FECHA_IMPORTANTE_PORT)
    private readonly fechaImportantePort: FechaImportantePort,
    @Inject(PERIODO_PORT)
    private readonly periodoPort: PeriodoPort,
  ) {}

  /**
   * Obtiene todas las fechas importantes de un anexo.
   */
  async findByAnexoId(anexoId: string): Promise<FechaImportanteAnexo[]> {
    return this.fechaImportantePort.findByAnexoId(anexoId);
  }

  /**
   * Crea una nueva fecha importante.
   */
  async create(userId: string, dto: CreateFechaImportanteDto): Promise<FechaImportanteAnexo> {
    return this.fechaImportantePort.create({
      anexoId: dto.anexoId,
      titulo: dto.titulo,
      fechaInicio: dto.fechaInicio,
      fechaFin: dto.fechaFin ?? null,
      periodoId: dto.periodoId ?? null,
      userId,
    });
  }

  /**
   * Importación masiva de fechas importantes.
   * Crea períodos automáticamente si se proporcionan nombres de período.
   */
  async bulkImport(userId: string, dto: BulkImportFechaDto): Promise<FechaImportanteAnexo[]> {
    const periodoMap = new Map<string, string>();

    // Collect unique period names
    const uniquePeriodoNombres = [
      ...new Set(
        dto.fechas
          .filter((f) => f.periodoNombre)
          .map((f) => f.periodoNombre as string),
      ),
    ];

    // Find or create periods
    for (const nombre of uniquePeriodoNombres) {
      const existing = await this.periodoPort.findByNombreAndUserId(nombre, userId);
      if (existing) {
        periodoMap.set(nombre, existing.id);
      } else {
        const created = await this.periodoPort.create({ nombre, userId });
        periodoMap.set(nombre, created.id);
      }
    }

    const fechasToCreate: Partial<FechaImportanteAnexo>[] = dto.fechas.map((f) => ({
      anexoId: dto.anexoId,
      titulo: f.titulo,
      fechaInicio: f.fechaInicio,
      fechaFin: f.fechaFin ?? null,
      periodoId: f.periodoNombre ? periodoMap.get(f.periodoNombre) ?? null : null,
      userId,
    }));

    return this.fechaImportantePort.createBulk(fechasToCreate);
  }

  /**
   * Actualiza una fecha importante existente.
   */
  async update(id: string, dto: UpdateFechaImportanteDto): Promise<FechaImportanteAnexo> {
    const data: Partial<FechaImportanteAnexo> = {};
    if (dto.titulo !== undefined) data.titulo = dto.titulo;
    if (dto.fechaInicio !== undefined) data.fechaInicio = dto.fechaInicio;
    if (dto.fechaFin !== undefined) data.fechaFin = dto.fechaFin ?? null;
    if (dto.periodoId !== undefined) data.periodoId = dto.periodoId ?? null;

    return this.fechaImportantePort.update(id, data);
  }

  /**
   * Elimina una fecha importante por su ID.
   */
  async delete(id: string): Promise<void> {
    return this.fechaImportantePort.delete(id);
  }

  /**
   * Cuenta cuántas fechas importantes usan un periodo determinado.
   */
  async countByPeriodoId(periodoId: string): Promise<number> {
    return this.fechaImportantePort.countByPeriodoId(periodoId);
  }
}
