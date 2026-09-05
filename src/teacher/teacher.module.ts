import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { TeacherService } from './teacher.service';
import { TeacherResolver } from './teacher.resolver';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { CourseTeacher } from 'src/course/entities/course_teacher.entity';
import { CourseModule } from 'src/course/course.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Teacher]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    CourseModule,
    SubscriptionModule,
  ],
  exports: [TeacherService],
  providers: [TeacherService, TeacherResolver],
})
export class TeacherModule {}
