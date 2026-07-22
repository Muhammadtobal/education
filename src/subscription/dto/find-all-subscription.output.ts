import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import {Subscription} from "../entities/subscription.entity";

@ObjectType()
export class SubscriptionPaginationResultOutput {
  @Field(() => [Subscription])
  items: Subscription[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}