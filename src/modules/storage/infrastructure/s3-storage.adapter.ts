import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StoragePort } from '../domain/ports/storage.port.js';

/**
 * Adaptador de infraestructura para S3/MinIO.
 * Implementa el puerto StoragePort usando AWS SDK v3.
 */
@Injectable()
export class S3StorageAdapter implements StoragePort {
  private readonly client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      endpoint: this.configService.get<string>('s3.endpoint'),
      region: this.configService.get<string>('s3.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('s3.accessKey', ''),
        secretAccessKey: this.configService.get<string>('s3.secretKey', ''),
      },
      forcePathStyle: this.configService.get<boolean>('s3.usePathStyle', true),
    });
  }

  async upload(bucket: string, key: string, body: Buffer, contentType: string): Promise<string> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
    return key;
  }

  async delete(bucket: string, key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
  }

  async getSignedUrl(bucket: string, key: string, expiresInSeconds: number): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    return getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }
}
