import { Field, ObjectType } from "@nestjs/graphql";
import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import { Constant } from "../entities/constant.entity";

@ObjectType()
export class ConstantPaginationResultOutput {
  @Field(() => [Constant])
  items: Constant[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
