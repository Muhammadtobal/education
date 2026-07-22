import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import {Review} from "../entities/review.entity";

@ObjectType()
export class ReviewPaginationResultOutput {
  @Field(() => [Review])
  items: Review[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}