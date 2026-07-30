import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from './entities/story.entity';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { EmployeeVendorModule } from 'src/employee_vendor/employee_vendor.module';

@Module({
  imports: [TypeOrmModule.forFeature([Story]), EmployeeVendorModule],
  providers: [StoryService, StoryResolver],
})
export class StoryModule {}
