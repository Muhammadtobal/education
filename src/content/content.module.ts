import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { ContentService } from './content.service';
import { ContentResolver } from './content.resolver';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { CourseModule } from 'src/course/course.module';
import { AppModule } from 'src/app.module';
import { VideoAsset } from './entities/video_asset.entity';
import { BullModule } from '@nestjs/bullmq';
import { VideoProcessingProcessor } from './processors/video-processing.processor';
@Module({
  imports: [
    TypeOrmModule.forFeature([Content, VideoAsset]),

    BullModule.registerQueue({
      name: 'video-processing',
    }),

    forwardRef(() => SubscriptionModule),
    forwardRef(() => AppModule),
  ],

  exports: [ContentService],

  providers: [ContentService, ContentResolver, VideoProcessingProcessor],
})
export class ContentModule {}
