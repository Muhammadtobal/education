import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import {Story} from "../entities/story.entity";

@ObjectType()
export class StoryPaginationResultOutput {
  @Field(() => [Story])
  items: Story[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}