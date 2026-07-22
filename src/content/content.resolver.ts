import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ContentService } from "./content.service";
import { Content } from "./entities/content.entity";
import { CreateContentInput } from "./dto/create-content.input";
import { UpdateContentInput } from "./dto/update-content.input";
import { ContentPaginationResultOutput } from "./dto/find-all-content.output";
import { FindAllContentInput } from "./dto/find-all-content.input";
import { DoneResponseOutput } from "src/shared/types/done-output";

@Resolver(() => Content)
export class ContentResolver {
  constructor(private readonly contentService: ContentService) {}

  @Mutation(() => Content)
  public createContent(
    @Args("createContentInput") createContentInput: CreateContentInput,
  ) {
    return this.contentService.create(createContentInput);
  }

  @Query(() => ContentPaginationResultOutput, { name: "contents" })
  public findAll(@Args("filter") filter: FindAllContentInput) {
    return this.contentService.findAll(filter);
  }

  @Query(() => Content, { name: "content" })
  public findOne(@Args("id") id: string) {
    return this.contentService.findOne({ id });
  }

  @Mutation(() => Content)
  public updateContent(
    @Args("updateContentInput") updateContentInput: UpdateContentInput,
  ) {
    return this.contentService.update(updateContentInput);
  }

  @Mutation(() => DoneResponseOutput)
  public removeContent(@Args("id") id: string) {
    this.contentService.remove(id);
    return { done: true };
  }
}