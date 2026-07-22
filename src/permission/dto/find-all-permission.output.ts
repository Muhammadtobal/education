import { Field, ObjectType } from "@nestjs/graphql";
import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import { Permission } from "../entities/permission.entity";

@ObjectType()
export class PermissionPaginationResultOutput {
  @Field(() => [Permission])
  items: Permission[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
