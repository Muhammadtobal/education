import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { LoginHistoryService } from './login_history.service';
import { LoginHistory } from './entities/login_history.entity';

import { CreateLoginHistoryInput } from './dto/create-login_history.input';
import { UpdateLoginHistoryInput } from './dto/update-login_history.input';
import { LoginHistoryPaginationResultOutput } from './dto/find-all-login_history.output';
import { FindAllLoginHistoryInput } from './dto/find-all-login_history.input';

import { DoneResponseOutput } from 'src/shared/types/done-output';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';

@Resolver(() => LoginHistory)
export class LoginHistoryResolver {
  constructor(private readonly loginHistoryService: LoginHistoryService) {}

  @Mutation(() => LoginHistory)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + LoginHistory.name)
  public createLoginHistory(
    @Args('createLoginHistoryInput')
    createLoginHistoryInput: CreateLoginHistoryInput,
  ) {
    return this.loginHistoryService.create(createLoginHistoryInput);
  }

  @Query(() => LoginHistoryPaginationResultOutput, { name: 'loginHistorys' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + LoginHistory.name)
  public findAll(@Args('filter') filter: FindAllLoginHistoryInput) {
    return this.loginHistoryService.findAll(filter);
  }

  @Query(() => LoginHistory, { name: 'loginHistory' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + LoginHistory.name)
  public findOne(@Args('id') id: string) {
    return this.loginHistoryService.findOne({ id });
  }

  @Mutation(() => LoginHistory)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + LoginHistory.name)
  public updateLoginHistory(
    @Args('updateLoginHistoryInput')
    updateLoginHistoryInput: UpdateLoginHistoryInput,
  ) {
    return this.loginHistoryService.update(updateLoginHistoryInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + LoginHistory.name)
  public removeLoginHistory(@Args('id') id: string) {
    this.loginHistoryService.remove(id);

    return {
      done: true,
    };
  }
}
