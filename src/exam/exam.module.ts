import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Exam } from "./entities/exam.entity";
import { ExamService } from "./exam.service";
import { ExamResolver } from "./exam.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([Exam])],
  providers: [ExamService, ExamResolver],
})
export class ExamModule {}