import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import {VendorLevel} from "../entities/vendor-level.entity";

@ObjectType()
export class VendorLevelPaginationResultOutput {
  @Field(() => [VendorLevel])
  items: VendorLevel[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}