import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AnswerService } from './answer.service';
import { Answer } from './entities/answer.entity';
import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';
import { FindAllAnswerInput } from './dto/find-all-answer.input';
import { AnswerPaginationResultOutput } from './dto/find-all-answer.output';
import { DoneResponseOutput } from 'src/shared/types/done-output';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { JwtAuthEmployeeGuard } from 'src/auth/guards/jwt-auth-employee.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';
import { AnswerUser } from './entities/answer-user.entity';
import { UpdateAnswerUserInput } from './dto/update-answer-user.input';
import { AnswerUserPaginationResultOutput } from './dto/find-all-answer-user.output';
import { FindAllAnswerUserInput } from './dto/find-all-answer-user.input';
import { CreateAnswerUserInput } from './dto/create-answer-user.input';

@Resolver(() => Answer)
export class AnswerResolver {
  constructor(private readonly answerService: AnswerService) {}

  @Mutation(() => Answer)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Answer.name)
  public createAnswer(
    @Args('createAnswerInput') createAnswerInput: CreateAnswerInput,
  ) {
    return this.answerService.create(createAnswerInput);
  }

  @Query(() => AnswerPaginationResultOutput, { name: 'answers' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Answer.name)
  public findAll(@Args('filter') filter: FindAllAnswerInput) {
    return this.answerService.findAll(filter);
  }

  @Query(() => Answer, { name: 'answer' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Answer.name)
  public findOne(@Args('id') id: string) {
    return this.answerService.findOne({ id });
  }

  @Mutation(() => Answer)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Answer.name)
  public updateAnswer(
    @Args('updateAnswerInput') updateAnswerInput: UpdateAnswerInput,
  ) {
    return this.answerService.update(updateAnswerInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Answer.name)
  public removeAnswer(@Args('id') id: string) {
    this.answerService.remove(id);

    return {
      done: true,
    };
  }

  @Mutation(() => AnswerUser)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + AnswerUser.name)
  public createAnswerUser(
    @Args('createAnswerUserInput')
    createAnswerUserInput: CreateAnswerUserInput,
  ) {
    return this.answerService.createAnswerUser(createAnswerUserInput);
  }

  @Query(() => AnswerUserPaginationResultOutput, { name: 'answer_users' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + AnswerUser.name)
  public findAllAnswerUser(@Args('filter') filter: FindAllAnswerUserInput) {
    return this.answerService.findAllAnswerUser(filter);
  }

  @Query(() => AnswerUser, { name: 'answer_user' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + AnswerUser.name)
  public findOneAnswerUser(@Args('id') id: string) {
    return this.answerService.findOneAnswerUser({ id });
  }

  @Mutation(() => AnswerUser)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + AnswerUser.name)
  public updateAnswerUser(
    @Args('updateAnswerUserInput')
    updateAnswerUserInput: UpdateAnswerUserInput,
  ) {
    return this.answerService.updateAnswerUser(updateAnswerUserInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + AnswerUser.name)
  public removeAnswerUser(@Args('id') id: string) {
    this.answerService.removeAnswerUser(id);

    return {
      done: true,
    };
  }
}
