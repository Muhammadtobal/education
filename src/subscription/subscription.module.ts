import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionService } from './subscription.service';
import { SubscriptionResolver } from './subscription.resolver';
import { ContentModule } from 'src/content/content.module';
import { PlanCourseModule } from 'src/plan_course/plan_course.module';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription]),
    ContentModule,
    PlanCourseModule,
    CourseModule,
  ],
  exports: [SubscriptionService],
  providers: [SubscriptionService, SubscriptionResolver],
})
export class SubscriptionModule {}
