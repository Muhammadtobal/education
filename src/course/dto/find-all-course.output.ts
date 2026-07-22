import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import {Course} from "../entities/course.entity";

@ObjectType()
export class CoursePaginationResultOutput {
  @Field(() => [Course])
  items: Course[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}