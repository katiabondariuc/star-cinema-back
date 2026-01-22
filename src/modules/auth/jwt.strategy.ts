import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'JWT_SUPER_SECRET_KEY',
    });
  }

  validate(payload: any) {
      console.log('JWT VALIDATE PAYLOAD:', payload);
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}