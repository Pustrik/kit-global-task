import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './at.strategy';

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['refreshToken'];
          }
          if (token) return <string>token.split(' ')[1];
          return null;
        },
      ]),
      secretOrKey: config.get<string>('RT_SECRET'),
    });
  }

  validate(token: string): any {
    const payload = token;
    if (!payload) throw new ForbiddenException('Refresh token malformed');

    return payload;
  }
}
