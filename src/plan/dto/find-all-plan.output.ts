import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import {Plan} from "../entities/plan.entity";

@ObjectType()
export class PlanPaginationResultOutput {
  @Field(() => [Plan])
  items: Plan[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}