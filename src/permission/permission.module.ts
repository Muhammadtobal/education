import { forwardRef, Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { PermissionService } from "./permission.service";
import { PermissionResolver } from "./permission.resolver";
import { Permission } from "./entities/permission.entity";
import { EmployeeModule } from "src/employee/employee.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    forwardRef(() => EmployeeModule),
  ],
  exports: [PermissionService],
  providers: [PermissionResolver, PermissionService],
})
export class PermissionModule {}
