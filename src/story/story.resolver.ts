import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { StoryService } from "./story.service";
import { Story } from "./entities/story.entity";
import { CreateStoryInput } from "./dto/create-story.input";
import { UpdateStoryInput } from "./dto/update-story.input";
import { StoryPaginationResultOutput } from "./dto/find-all-story.output";
import { FindAllStoryInput } from "./dto/find-all-story.input";
import { DoneResponseOutput } from "src/shared/types/done-output";

@Resolver(() => Story)
export class StoryResolver {
  constructor(private readonly storyService: StoryService) {}

  @Mutation(() => Story)
  public createStory(
    @Args("createStoryInput") createStoryInput: CreateStoryInput,
  ) {
    return this.storyService.create(createStoryInput);
  }

  @Query(() => StoryPaginationResultOutput, { name: "storys" })
  public findAll(@Args("filter") filter: FindAllStoryInput) {
    return this.storyService.findAll(filter);
  }

  @Query(() => Story, { name: "story" })
  public findOne(@Args("id") id: string) {
    return this.storyService.findOne({ id });
  }

  @Mutation(() => Story)
  public updateStory(
    @Args("updateStoryInput") updateStoryInput: UpdateStoryInput,
  ) {
    return this.storyService.update(updateStoryInput);
  }

  @Mutation(() => DoneResponseOutput)
  public removeStory(@Args("id") id: string) {
    this.storyService.remove(id);
    return { done: true };
  }
}