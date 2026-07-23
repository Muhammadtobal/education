import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanCourse } from './entities/plan_course.entity';
import { PlanCourseService } from './plan_course.service';
import { PlanCourseResolver } from './plan_course.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PlanCourse])],
  providers: [PlanCourseService, PlanCourseResolver],
})
export class PlanCourseModule {}
