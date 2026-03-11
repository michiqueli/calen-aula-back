/**
 * Puerto de dominio para operaciones de almacenamiento de archivos.
 * Define el contrato que debe implementar cualquier adaptador de storage.
 */
export interface StoragePort {
  /**
   * Sube un archivo al bucket especificado.
   * @param bucket - Nombre del bucket destino
   * @param key - Clave/ruta del archivo en el bucket
   * @param body - Contenido del archivo como Buffer
   * @param contentType - Tipo MIME del archivo
   * @returns URL pública o key del archivo subido
   */
  upload(bucket: string, key: string, body: Buffer, contentType: string): Promise<string>;

  /**
   * Elimina un archivo del bucket especificado.
   * @param bucket - Nombre del bucket
   * @param key - Clave/ruta del archivo a eliminar
   */
  delete(bucket: string, key: string): Promise<void>;

  /**
   * Genera una URL firmada temporal para acceder al archivo.
   * @param bucket - Nombre del bucket
   * @param key - Clave/ruta del archivo
   * @param expiresInSeconds - Tiempo de expiración en segundos
   * @returns URL firmada temporal
   */
  getSignedUrl(bucket: string, key: string, expiresInSeconds: number): Promise<string>;
}

export const STORAGE_PORT = Symbol('STORAGE_PORT');
