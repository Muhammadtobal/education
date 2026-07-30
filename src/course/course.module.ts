import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CourseService } from './course.service';
import { CourseResolver } from './course.resolver';
import { CourseTeacher } from './entities/course_teacher.entity';
import { EmployeeVendorModule } from 'src/employee_vendor/employee_vendor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, CourseTeacher]),
    EmployeeVendorModule,
  ],
  exports: [CourseService],
  providers: [CourseService, CourseResolver],
})
export class CourseModule {}
