import { Archivo } from '../entities/archivo.entity.js';

/**
 * Puerto de dominio para operaciones de archivos.
 */
export interface ArchivosPort {
  findAllByUserId(userId: string): Promise<Archivo[]>;
  findById(id: string): Promise<Archivo | null>;
  create(archivo: Partial<Archivo>): Promise<Archivo>;
  delete(id: string): Promise<void>;
}

export const ARCHIVOS_PORT = Symbol('ARCHIVOS_PORT');
