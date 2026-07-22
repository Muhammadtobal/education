import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { DiscussionService } from "./discussion.service";
import { Discussion } from "./entities/discussion.entity";
import { CreateDiscussionInput } from "./dto/create-discussion.input";
import { UpdateDiscussionInput } from "./dto/update-discussion.input";
import { DiscussionPaginationResultOutput } from "./dto/find-all-discussion.output";
import { FindAllDiscussionInput } from "./dto/find-all-discussion.input";
import { DoneResponseOutput } from "src/shared/types/done-output";

@Resolver(() => Discussion)
export class DiscussionResolver {
  constructor(private readonly discussionService: DiscussionService) {}

  @Mutation(() => Discussion)
  public createDiscussion(
    @Args("createDiscussionInput") createDiscussionInput: CreateDiscussionInput,
  ) {
    return this.discussionService.create(createDiscussionInput);
  }

  @Query(() => DiscussionPaginationResultOutput, { name: "discussions" })
  public findAll(@Args("filter") filter: FindAllDiscussionInput) {
    return this.discussionService.findAll(filter);
  }

  @Query(() => Discussion, { name: "discussion" })
  public findOne(@Args("id") id: string) {
    return this.discussionService.findOne({ id });
  }

  @Mutation(() => Discussion)
  public updateDiscussion(
    @Args("updateDiscussionInput") updateDiscussionInput: UpdateDiscussionInput,
  ) {
    return this.discussionService.update(updateDiscussionInput);
  }

  @Mutation(() => DoneResponseOutput)
  public removeDiscussion(@Args("id") id: string) {
    this.discussionService.remove(id);
    return { done: true };
  }
}