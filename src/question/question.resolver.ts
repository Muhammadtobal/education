import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { QuestionService } from './question.service';
import { Question } from './entities/question.entity';

import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { QuestionPaginationResultOutput } from './dto/find-all-question.output';
import { FindAllQuestionInput } from './dto/find-all-question.input';

import { DoneResponseOutput } from 'src/shared/types/done-output';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';

@Resolver(() => Question)
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) {}

  @Mutation(() => Question)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Question.name)
  public createQuestion(
    @Args('createQuestionInput')
    createQuestionInput: CreateQuestionInput,
  ) {
    return this.questionService.create(createQuestionInput);
  }

  @Query(() => QuestionPaginationResultOutput, { name: 'questions' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Question.name)
  public findAll(@Args('filter') filter: FindAllQuestionInput) {
    return this.questionService.findAll(filter);
  }

  @Query(() => Question, { name: 'question' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Question.name)
  public findOne(@Args('id') id: string) {
    return this.questionService.findOne({ id });
  }

  @Mutation(() => Question)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Question.name)
  public updateQuestion(
    @Args('updateQuestionInput')
    updateQuestionInput: UpdateQuestionInput,
  ) {
    return this.questionService.update(updateQuestionInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Question.name)
  public removeQuestion(@Args('id') id: string) {
    this.questionService.remove(id);

    return {
      done: true,
    };
  }
}
