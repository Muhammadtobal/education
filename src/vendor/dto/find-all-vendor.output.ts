import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import {Vendor} from "../entities/vendor.entity";

@ObjectType()
export class VendorPaginationResultOutput {
  @Field(() => [Vendor])
  items: Vendor[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}