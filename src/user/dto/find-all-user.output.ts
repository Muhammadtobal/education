import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import { User } from "../entities/user.entity";

@ObjectType()
export class UserPaginationResultOutput {
  @Field(() => [User])
  items: User[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
