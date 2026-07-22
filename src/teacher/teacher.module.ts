import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { TeacherService } from './teacher.service';
import { TeacherResolver } from './teacher.resolver';
import { TeacherVendor } from './entities/teacher-vedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, TeacherVendor])],
  exports: [TeacherService],
  providers: [TeacherService, TeacherResolver],
})
export class TeacherModule {}
