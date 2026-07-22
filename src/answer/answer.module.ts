import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Answer } from "./entities/answer.entity";
import { AnswerService } from "./answer.service";
import { AnswerResolver } from "./answer.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([Answer])],
  providers: [AnswerService, AnswerResolver],
})
export class AnswerModule {}