import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { JwtService } from '@nestjs/jwt';
// import { nanoid } from "nanoid/async";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  public async generateRefreshToken() {
    return await nanoid(64);
  }

  public generateJwtToken(payload: any, secret: string) {
    return this.jwtService.signAsync(payload, { secret, expiresIn: '15m' });
  }

  public generateActivationCode() {
    return Math.floor(Math.random() * 900000) + 100000;
  }

  public validateJwtToken(token: string, key: string) {
    return this.jwtService.verifyAsync(token, { secret: key });
  }
}
