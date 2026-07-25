import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { ConstantService } from './constant.service';
import { Constant } from './entities/constant.entity';
import { CreateConstantInput } from './dto/create-constant.input';
import { UpdateConstantInput } from './dto/update-constant.input';
import { FindAllConstantInput } from './dto/find-all-constant.input';
import { DoneResponseOutput } from 'src/shared/types/done-output';
import { JwtAuthEmployeeGuard } from 'src/auth/guards/jwt-auth-employee.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';
import { ConstantPaginationResultOutput } from './dto/find-all-constant.output';

@Resolver(() => Constant)
export class ConstantResolver {
  constructor(private readonly constantService: ConstantService) {}

  @Mutation(() => Constant)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.CREATE + Constant.name)
  public createConstant(
    @Args('createConstantInput') createConstantInput: CreateConstantInput,
  ) {
    return this.constantService.create(createConstantInput);
  }

  @Query(() => [Constant], { name: 'constants' })
  public findAll() {
    return this.constantService.findAll(true);
  }

  @Query(() => Constant, { name: 'constantByKey' })
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.GET + Constant.name)
  public findOne(@Args('key') key: string) {
    return this.constantService.findOne({ key });
  }

  @Mutation(() => Constant)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.UPDATE + Constant.name)
  public updateConstant(
    @Args('updateConstantInput') updateConstantInput: UpdateConstantInput,
  ) {
    return this.constantService.update(updateConstantInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.DELETE + Constant.name)
  public async removeConstant(@Args('id') id: string) {
    await this.constantService.remove(id);
    return { done: true };
  }
}
