import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { PlanService } from './plan.service';
import { PlanResolver } from './plan.resolver';
import { EmployeeVendorModule } from 'src/employee_vendor/employee_vendor.module';

@Module({
  imports: [TypeOrmModule.forFeature([Plan]), EmployeeVendorModule],
  providers: [PlanService, PlanResolver],
})
export class PlanModule {}
