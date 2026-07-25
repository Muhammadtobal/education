import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { DiscussionService } from './discussion.service';
import { Discussion } from './entities/discussion.entity';

import { CreateDiscussionInput } from './dto/create-discussion.input';
import { UpdateDiscussionInput } from './dto/update-discussion.input';
import { FindAllDiscussionInput } from './dto/find-all-discussion.input';
import { DiscussionPaginationResultOutput } from './dto/find-all-discussion.output';

import { DoneResponseOutput } from 'src/shared/types/done-output';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';

@Resolver(() => Discussion)
export class DiscussionResolver {
  constructor(private readonly discussionService: DiscussionService) {}

  @Mutation(() => Discussion)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Discussion.name)
  public createDiscussion(
    @Args('createDiscussionInput') createDiscussionInput: CreateDiscussionInput,
  ) {
    return this.discussionService.create(createDiscussionInput);
  }

  @Query(() => DiscussionPaginationResultOutput, { name: 'discussions' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Discussion.name)
  public findAll(@Args('filter') filter: FindAllDiscussionInput) {
    return this.discussionService.findAll(filter);
  }

  @Query(() => Discussion, { name: 'discussion' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Discussion.name)
  public findOne(@Args('id') id: string) {
    return this.discussionService.findOne({ id });
  }

  @Mutation(() => Discussion)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Discussion.name)
  public updateDiscussion(
    @Args('updateDiscussionInput') updateDiscussionInput: UpdateDiscussionInput,
  ) {
    return this.discussionService.update(updateDiscussionInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Discussion.name)
  public removeDiscussion(@Args('id') id: string) {
    this.discussionService.remove(id);

    return {
      done: true,
    };
  }
}
