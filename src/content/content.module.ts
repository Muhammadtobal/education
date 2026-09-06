import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { ContentService } from './content.service';
import { ContentResolver } from './content.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Content])],
  exports: [ContentService],
  providers: [ContentService, ContentResolver],
})
export class ContentModule {}
