import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { ContentService } from './content.service';
import { ContentResolver } from './content.resolver';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content]),
    forwardRef(() => SubscriptionModule),
  ],
  exports: [ContentService],
  providers: [ContentService, ContentResolver],
})
export class ContentModule {}
