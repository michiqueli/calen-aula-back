import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Anexo } from '../../domain/entities/anexo.entity.js';
import { AnexoPort } from '../../domain/ports/anexo.port.js';

/**
 * Adaptador de persistencia para la entidad Anexo.
 * Implementa el puerto AnexoPort usando TypeORM.
 */
@Injectable()
export class AnexoRepository implements AnexoPort {
  constructor(
    @InjectRepository(Anexo)
    private readonly repo: Repository<Anexo>,
  ) {}

  async findAllByUserId(userId: string): Promise<Anexo[]> {
    return this.repo.find({
      where: { userId },
      relations: ['fechasImportantesAnexo'],
      order: { numero: 'ASC' },
    });
  }

  async findById(id: string): Promise<Anexo | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(anexoData: Partial<Anexo>): Promise<Anexo> {
    const anexo = this.repo.create(anexoData);
    return this.repo.save(anexo);
  }

  async update(id: string, data: Partial<Anexo>): Promise<Anexo> {
    await this.repo.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Anexo con id ${id} no encontrado`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async checkDuplicate(numero: number, userId: string): Promise<Anexo | null> {
    return this.repo.findOne({ where: { numero, userId } });
  }
}
