import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { StoryService } from './story.service';
import { Story } from './entities/story.entity';

import { CreateStoryInput } from './dto/create-story.input';
import { UpdateStoryInput } from './dto/update-story.input';
import { StoryPaginationResultOutput } from './dto/find-all-story.output';
import { FindAllStoryInput } from './dto/find-all-story.input';

import { DoneResponseOutput } from 'src/shared/types/done-output';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';

@Resolver(() => Story)
export class StoryResolver {
  constructor(private readonly storyService: StoryService) {}

  @Mutation(() => Story)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Story.name)
  public createStory(
    @Args('createStoryInput') createStoryInput: CreateStoryInput,
  ) {
    return this.storyService.create(createStoryInput);
  }

  @Query(() => StoryPaginationResultOutput, { name: 'stories' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Story.name)
  public findAll(@Args('filter') filter: FindAllStoryInput) {
    return this.storyService.findAll(filter);
  }

  @Query(() => Story, { name: 'story' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Story.name)
  public findOne(@Args('id') id: string) {
    return this.storyService.findOne({ id });
  }

  @Mutation(() => Story)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Story.name)
  public updateStory(
    @Args('updateStoryInput') updateStoryInput: UpdateStoryInput,
  ) {
    return this.storyService.update(updateStoryInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Story.name)
  public removeStory(@Args('id') id: string) {
    this.storyService.remove(id);

    return {
      done: true,
    };
  }
}
