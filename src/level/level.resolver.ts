import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { LevelService } from './level.service';
import { Level } from './entities/level.entity';

import { CreateLevelInput } from './dto/create-level.input';
import { UpdateLevelInput } from './dto/update-level.input';
import { LevelPaginationResultOutput } from './dto/find-all-level.output';
import { FindAllLevelInput } from './dto/find-all-level.input';

import { DoneResponseOutput } from 'src/shared/types/done-output';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';

@Resolver(() => Level)
export class LevelResolver {
  constructor(private readonly levelService: LevelService) {}

  @Mutation(() => Level)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Level.name)
  public createLevel(
    @Args('createLevelInput') createLevelInput: CreateLevelInput,
  ) {
    return this.levelService.create(createLevelInput);
  }

  @Query(() => LevelPaginationResultOutput, { name: 'levels' })
  @Permissions(Operation.GET + Level.name)
  public findAll(@Args('filter') filter: FindAllLevelInput) {
    return this.levelService.findAll(filter);
  }

  @Query(() => Level, { name: 'level' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Level.name)
  public findOne(@Args('id') id: string) {
    return this.levelService.findOne({ id });
  }

  @Mutation(() => Level)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Level.name)
  public updateLevel(
    @Args('updateLevelInput') updateLevelInput: UpdateLevelInput,
  ) {
    return this.levelService.update(updateLevelInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Level.name)
  public removeLevel(@Args('id') id: string) {
    this.levelService.remove(id);

    return {
      done: true,
    };
  }
}
