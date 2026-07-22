import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtVendorStrategy extends PassportStrategy(Strategy, "jwt-vendor") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.VENDOR_JWT_KEY}`,
    });
  }

  validate(payload: any) {
    return { vendorId: payload.vendorId };
  }
}