import { ArchivoAnexo } from '../entities/archivo-anexo.entity.js';

/**
 * Puerto de dominio para operaciones de archivos anexos.
 */
export interface ArchivosAnexosPort {
  findByAnexoId(anexoId: string, userId: string): Promise<ArchivoAnexo[]>;
  findAllByUserId(userId: string): Promise<ArchivoAnexo[]>;
  findById(id: string): Promise<ArchivoAnexo | null>;
  create(archivoAnexo: Partial<ArchivoAnexo>): Promise<ArchivoAnexo>;
  updateTitle(id: string, nombreArchivo: string): Promise<void>;
  delete(id: string): Promise<void>;
}

export const ARCHIVOS_ANEXOS_PORT = Symbol('ARCHIVOS_ANEXOS_PORT');
