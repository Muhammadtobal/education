import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service';
import { EmployeeResolver } from './employee.resolver';

import { Employee } from './entities/employee.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EmployeePermissionModule } from 'src/employee_permission/employee_permission.module';
import { PermissionModule } from 'src/permission/permission.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    forwardRef(() => AuthModule),
    EmployeePermissionModule,
    forwardRef(() => UserModule),
    forwardRef(() => PermissionModule),
  ],
  exports: [EmployeeService],
  providers: [EmployeeResolver, EmployeeService],
})
export class EmployeeModule {}
