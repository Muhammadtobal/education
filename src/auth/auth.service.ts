import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { JwtService } from '@nestjs/jwt';
import { Employee } from 'src/employee/entities/employee.entity';
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

  async canAccess(
    employee: Employee,
    permissionName: string,
    vendorId?: string,
  ) {
    const isVendorEmployee = employee.employee_vendors?.some(
      (ev) => ev.vendor_id === vendorId,
    );

    if (isVendorEmployee) {
      return employee.employee_permissions.some(
        (ep) => ep.permission?.name === permissionName,
      );
    }

    return employee.employee_permissions.some(
      (ep) =>
        ep.permission?.name === permissionName &&
        ep.permission?.for_vendor === false,
    );
  }
}
