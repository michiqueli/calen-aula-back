import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'default-secret-change-me',
  expiration: process.env.JWT_EXPIRATION || '1d',
  refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));
