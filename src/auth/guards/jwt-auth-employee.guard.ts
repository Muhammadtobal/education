import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Permission } from 'src/permission/entities/permission.entity';

@Injectable()
export class JwtAuthEmployeeGuard extends AuthGuard('jwt-employee') {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  canActivate(context: any) {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    context.requiredPermission = requiredPermissions
      ? requiredPermissions[0]
      : undefined;

    return super.canActivate(context);
  }

  handleRequest(error: any, user: any, info: any, context: any) {
    if (error || !user) throw new UnauthorizedException();

    const permission = context.requiredPermission;

    const isVendorEmployee = user.employee_vendors?.length > 0;

    if (isVendorEmployee) {
      if (user.permissions.includes(permission)) {
        return user;
      }
    } else {
      if (user.permissions.includes(permission)) {
        return user;
      }
    }

    throw new UnauthorizedException();
  }
}
