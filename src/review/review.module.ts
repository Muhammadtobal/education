import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';
import { ReviewResolver } from './review.resolver';
import { TeacherModule } from 'src/teacher/teacher.module';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), TeacherModule, CourseModule],
  providers: [ReviewService, ReviewResolver],
})
export class ReviewModule {}
