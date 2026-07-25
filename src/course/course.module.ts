import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CourseService } from './course.service';
import { CourseResolver } from './course.resolver';
import { CourseTeacher } from './entities/course_teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, CourseTeacher])],
  providers: [CourseService, CourseResolver],
})
export class CourseModule {}
