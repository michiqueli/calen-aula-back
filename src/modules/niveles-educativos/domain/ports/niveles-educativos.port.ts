import { NivelEducativo } from '../entities/nivel-educativo.entity.js';

/**
 * Puerto de dominio para operaciones sobre niveles educativos.
 */
export interface NivelesEducativosPort {
  findAll(): Promise<NivelEducativo[]>;
  findAllActive(): Promise<NivelEducativo[]>;
  findById(id: string): Promise<NivelEducativo | null>;
  create(data: Partial<NivelEducativo>): Promise<NivelEducativo>;
  update(id: string, data: Partial<NivelEducativo>): Promise<NivelEducativo>;
  delete(id: string): Promise<void>;
}

export const NIVELES_EDUCATIVOS_PORT = Symbol('NIVELES_EDUCATIVOS_PORT');
