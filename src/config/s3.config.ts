import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.S3_SECRET_KEY || 'minioadmin',
  region: process.env.S3_REGION || 'us-east-1',
  bucketAnexoFiles: process.env.S3_BUCKET_ANEXO_FILES || 'anexo-files',
  bucketFiles: process.env.S3_BUCKET_FILES || 'files',
  usePathStyle: process.env.S3_USE_PATH_STYLE === 'true',
}));
