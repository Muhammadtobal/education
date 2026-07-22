import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Plan } from "./entities/plan.entity";
import { PlanService } from "./plan.service";
import { PlanResolver } from "./plan.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([Plan])],
  providers: [PlanService, PlanResolver],
})
export class PlanModule {}