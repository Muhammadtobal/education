import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Permission } from 'src/permission/entities/permission.entity';

@Injectable()
export class JwtAuthEmployeeUserGuard extends AuthGuard([
  'jwt-user',
  'jwt-employee',
]) {
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
    if (error || !user) {
      throw new UnauthorizedException();
    }

    if (user.type === 'employee') {
      const permission = context.requiredPermission;

      const isVendorEmployee = user.employee_vendors?.length > 0;

      if (isVendorEmployee) {
        if (!user.permissions.includes(permission)) {
          throw new UnauthorizedException();
        }
      } else {
        if (!user.permissions.includes(permission)) {
          throw new UnauthorizedException();
        }
      }
    }

    return user;
  }
}
