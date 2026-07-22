import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import {Teacher} from "../entities/teacher.entity";

@ObjectType()
export class TeacherPaginationResultOutput {
  @Field(() => [Teacher])
  items: Teacher[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}