import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { AnswerService } from './answer.service';
import { AnswerResolver } from './answer.resolver';
import { AnswerUser } from './entities/answer-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, AnswerUser])],
  providers: [AnswerService, AnswerResolver],
})
export class AnswerModule {}
