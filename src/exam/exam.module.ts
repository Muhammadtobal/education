import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';
import { ExamService } from './exam.service';
import { ExamResolver } from './exam.resolver';
import { ExamUser } from './entities/exam-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, ExamUser])],
  providers: [ExamService, ExamResolver],
})
export class ExamModule {}
