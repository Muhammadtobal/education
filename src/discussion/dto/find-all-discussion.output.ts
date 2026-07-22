import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import {Discussion} from "../entities/discussion.entity";

@ObjectType()
export class DiscussionPaginationResultOutput {
  @Field(() => [Discussion])
  items: Discussion[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}