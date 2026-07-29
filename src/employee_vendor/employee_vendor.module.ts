import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeVendor } from './entities/employee_vendor.entity';
import { EmployeeVendorService } from './employee_vendor.service';
import { EmployeeVendorResolver } from './employee_vendor.resolver';
import { PermissionModule } from 'src/permission/permission.module';
import { EmployeeModule } from 'src/employee/employee.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeVendor]),
    PermissionModule,
    EmployeeModule,
  ],
  providers: [EmployeeVendorService, EmployeeVendorResolver],
})
export class EmployeeVendorModule {}
