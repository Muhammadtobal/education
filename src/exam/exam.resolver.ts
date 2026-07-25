import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { ExamService } from './exam.service';
import { Exam } from './entities/exam.entity';

import { CreateExamInput } from './dto/create-exam.input';
import { UpdateExamInput } from './dto/update-exam.input';
import { FindAllExamInput } from './dto/find-all-exam.input';
import { ExamPaginationResultOutput } from './dto/find-all-exam.output';

import { DoneResponseOutput } from 'src/shared/types/done-output';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';
import { ExamUser } from './entities/exam-user.entity';
import { CreateExamUserInput } from './dto/create-exam_user.input';
import { ExamUserPaginationResultOutput } from './dto/find-all-exam_user.output';
import { FindAllExamUserInput } from './dto/find-all-exam_user.input';
import { UpdateExamUserInput } from './dto/update-exam_user.input';

@Resolver(() => Exam)
export class ExamResolver {
  constructor(private readonly examService: ExamService) {}

  @Mutation(() => Exam)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Exam.name)
  public createExam(@Args('createExamInput') createExamInput: CreateExamInput) {
    return this.examService.create(createExamInput);
  }

  @Query(() => ExamPaginationResultOutput, { name: 'exams' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Exam.name)
  public findAll(@Args('filter') filter: FindAllExamInput) {
    return this.examService.findAll(filter);
  }

  @Query(() => Exam, { name: 'exam' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Exam.name)
  public findOne(@Args('id') id: string) {
    return this.examService.findOne({ id });
  }

  @Mutation(() => Exam)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Exam.name)
  public updateExam(@Args('updateExamInput') updateExamInput: UpdateExamInput) {
    return this.examService.update(updateExamInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Exam.name)
  public removeExam(@Args('id') id: string) {
    this.examService.remove(id);

    return {
      done: true,
    };
  }

  @Mutation(() => ExamUser)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + ExamUser.name)
  public createExamUser(
    @Args('createExamUserInput')
    createExamUserInput: CreateExamUserInput,
  ) {
    return this.examService.createExamUser(createExamUserInput);
  }

  @Query(() => ExamUserPaginationResultOutput, { name: 'exam_users' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + ExamUser.name)
  public findAllExamUser(@Args('filter') filter: FindAllExamUserInput) {
    return this.examService.findAllExamUser(filter);
  }

  @Query(() => ExamUser, { name: 'examUser' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + ExamUser.name)
  public findOneExamUser(@Args('id') id: string) {
    return this.examService.findOneExamUser({ id });
  }

  @Mutation(() => ExamUser)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + ExamUser.name)
  public updateExamUser(
    @Args('updateExamUserInput')
    updateExamUserInput: UpdateExamUserInput,
  ) {
    return this.examService.updateExamUser(updateExamUserInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + ExamUser.name)
  public removeExamUser(@Args('id') id: string) {
    this.examService.removeExamUser(id);

    return {
      done: true,
    };
  }
}
