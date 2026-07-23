import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { PlanCoupon } from '../entities/plan_coupon.entity';

@ObjectType()
export class PlanCouponPaginationResultOutput {
  @Field(() => [PlanCoupon])
  items: PlanCoupon[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
