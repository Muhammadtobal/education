import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeVendor } from "./entities/employee_vendor.entity";
import { EmployeeVendorService } from "./employee_vendor.service";
import { EmployeeVendorResolver } from "./employee_vendor.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeVendor])],
  providers: [EmployeeVendorService, EmployeeVendorResolver],
})
export class EmployeeVendorModule {}