import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtTeacherStrategy extends PassportStrategy(
  Strategy,
  'jwt-teacher',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.TEACHER_JWT_KEY}`,
    });
  }

  validate(payload: any) {
    return { teacherId: payload.teacherId };
  }
}
