import { Module, Global } from '@nestjs/common';
import { S3StorageAdapter } from './infrastructure/s3-storage.adapter.js';
import { STORAGE_PORT } from './domain/ports/storage.port.js';

/**
 * Módulo global de Storage.
 * Provee el adaptador S3 como implementación del puerto StoragePort.
 */
@Global()
@Module({
  providers: [
    {
      provide: STORAGE_PORT,
      useClass: S3StorageAdapter,
    },
  ],
  exports: [STORAGE_PORT],
})
export class StorageModule {}
