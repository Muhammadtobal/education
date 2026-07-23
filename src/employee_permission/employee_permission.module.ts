import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeePermissionService } from './employee_permission.service';
import { EmployeePermissionResolver } from './employee_permission.resolver';
import { EmployeePermission } from './entities/employee_permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeePermission])],
  exports: [EmployeePermissionService],
  providers: [EmployeePermissionResolver, EmployeePermissionService],
})
export class EmployeePermissionModule {}
