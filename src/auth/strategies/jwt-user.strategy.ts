import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, "jwt-user") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.USER_JWT_KEY}`,
    });
  }

  validate(payload: any) {
    return { userId: payload.userId };
  }
}