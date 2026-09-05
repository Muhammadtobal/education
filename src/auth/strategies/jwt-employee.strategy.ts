import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EmployeeService } from 'src/employee/employee.service';
import { EmployeeJWTPayload } from 'src/shared/types/jwt-payload';

@Injectable()
export class JwtEmployeeStrategy extends PassportStrategy(
  Strategy,
  'jwt-employee',
) {
  constructor(private readonly employeeService: EmployeeService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.EMPLOYEE_JWT_KEY}`,
    });
  }

  // TODO: type and production notice
  async validate(payload: EmployeeJWTPayload) {
    const employee = await this.employeeService.findOne(
      { id: payload.empId },
      { relations: { employee_permissions: { permission: true } } },
    );

    if (!employee) {
      throw new Error('Invalid token or employee not found');
    }

    return {
      empId: payload.empId,
      type: 'employee',

      permissions: employee.employee_permissions.map(
        (employeePermission) => employeePermission.permission?.name,
      ),
    };
  }
}
