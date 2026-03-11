import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ANEXO_PORT, AnexoPort } from '../../domain/ports/anexo.port.js';
import { CreateAnexoDto } from '../dtos/create-anexo.dto.js';
import { UpdateAnexoDto } from '../dtos/update-anexo.dto.js';
import { Anexo } from '../../domain/entities/anexo.entity.js';

/**
 * Servicio de aplicación para gestión de anexos.
 */
@Injectable()
export class AnexoService {
  constructor(
    @Inject(ANEXO_PORT)
    private readonly anexoPort: AnexoPort,
  ) {}

  /**
   * Obtiene todos los anexos del usuario con sus fechas importantes cargadas.
   */
  async findAll(userId: string): Promise<Anexo[]> {
    return this.anexoPort.findAllByUserId(userId);
  }

  /**
   * Obtiene un anexo por su ID.
   */
  async findById(id: string): Promise<Anexo> {
    const anexo = await this.anexoPort.findById(id);
    if (!anexo) {
      throw new NotFoundException(`Anexo con id ${id} no encontrado`);
    }
    return anexo;
  }

  /**
   * Crea un nuevo anexo para el usuario.
   * @throws ConflictException si ya existe un anexo con el mismo número.
   */
  async create(userId: string, dto: CreateAnexoDto): Promise<Anexo> {
    const duplicate = await this.anexoPort.checkDuplicate(dto.numero, userId);
    if (duplicate) {
      throw new ConflictException(
        `Ya existe un anexo con el número ${dto.numero}`,
      );
    }

    return this.anexoPort.create({
      titulo: dto.titulo,
      numero: dto.numero,
      rangoLectivo: dto.rangoLectivo ?? null,
      fechaInicio: dto.fechaInicio ?? null,
      fechaFin: dto.fechaFin ?? null,
      userId,
    });
  }

  /**
   * Actualiza un anexo existente.
   */
  async update(id: string, dto: UpdateAnexoDto): Promise<Anexo> {
    await this.findById(id);
    return this.anexoPort.update(id, dto);
  }

  /**
   * Elimina un anexo por su ID.
   */
  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.anexoPort.delete(id);
  }
}
