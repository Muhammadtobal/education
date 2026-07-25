import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { ContentService } from './content.service';
import { Content } from './entities/content.entity';

import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { FindAllContentInput } from './dto/find-all-content.input';
import { ContentPaginationResultOutput } from './dto/find-all-content.output';

import { DoneResponseOutput } from 'src/shared/types/done-output';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';

@Resolver(() => Content)
export class ContentResolver {
  constructor(private readonly contentService: ContentService) {}

  @Mutation(() => Content)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Content.name)
  public createContent(
    @Args('createContentInput') createContentInput: CreateContentInput,
  ) {
    return this.contentService.create(createContentInput);
  }

  @Query(() => ContentPaginationResultOutput, { name: 'contents' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Content.name)
  public findAll(@Args('filter') filter: FindAllContentInput) {
    return this.contentService.findAll(filter);
  }

  @Query(() => Content, { name: 'content' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Content.name)
  public findOne(@Args('id') id: string) {
    return this.contentService.findOne({ id });
  }

  @Mutation(() => Content)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Content.name)
  public updateContent(
    @Args('updateContentInput') updateContentInput: UpdateContentInput,
  ) {
    return this.contentService.update(updateContentInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Content.name)
  public removeContent(@Args('id') id: string) {
    this.contentService.remove(id);

    return {
      done: true,
    };
  }
}
