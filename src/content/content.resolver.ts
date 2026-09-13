import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
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
import { TokenShowContentOutput } from './dto/token-show-content.output';
import { TokenShowContentInput } from './dto/token-show-content.input';
import { GqlContext } from 'src/shared/types/context';
import { getUserId } from 'src/shared/helpers';
import { CreateVideoUploadOutput } from './dto/create-video-upload.output';
import { CreateVideoUploadInput } from './dto/create-video-upload.input';
import { CompleteVideoUploadOutput } from './dto/complete-video-upload.output';
import { CompleteVideoUploadInput } from './dto/complete-video-upload.input';
import { VideoAsset } from './entities/video_asset.entity';

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

  @Query(() => TokenShowContentOutput)
  @UseGuards(JwtAuthSharedGuard)
  async getContentPlaybackUrl(
    @Context() context: GqlContext,
    @Args('input') tokenShowContentInput: TokenShowContentInput,
  ) {
    const user = context.req.user;
    const userId = getUserId(user);
    return this.contentService.getPlaybackUrl(
      userId,
      tokenShowContentInput.content_id,
    );
  }

  @Mutation(() => CreateVideoUploadOutput)
  @UseGuards(JwtAuthSharedGuard)
  async createVideoUpload(@Args('input') input: CreateVideoUploadInput) {
    return this.contentService.createVideoUpload(input);
  }

  @Mutation(() => CompleteVideoUploadOutput)
  @UseGuards(JwtAuthSharedGuard)
  async completeVideoUpload(@Args('input') input: CompleteVideoUploadInput) {
    const videoAsset = await this.contentService.completeVideoUpload(input);

    return {
      video_asset: videoAsset,
    };
  }

  @Query(() => VideoAsset, { name: 'video_Asset' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + VideoAsset.name)
  public findOneVideoAsset(@Args('id') id: string) {
    return this.contentService.findOneVideoAsset({ id });
  }
}
