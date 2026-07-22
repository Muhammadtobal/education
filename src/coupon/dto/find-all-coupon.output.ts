import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import {Coupon} from "../entities/coupon.entity";

@ObjectType()
export class CouponPaginationResultOutput {
  @Field(() => [Coupon])
  items: Coupon[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}