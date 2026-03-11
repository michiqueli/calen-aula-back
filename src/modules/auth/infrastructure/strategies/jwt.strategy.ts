import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../../../common/decorators/current-user.decorator.js';

/**
 * Estrategia JWT para Passport.
 * Valida y decodifica tokens JWT en cada request protegido.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret', 'default-secret'),
    });
  }

  validate(payload: { sub: string; email: string }): JwtPayload {
    return { sub: payload.sub, email: payload.email };
  }
}
