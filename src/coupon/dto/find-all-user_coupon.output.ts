import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { Coupon } from '../entities/coupon.entity';
import { UserCoupon } from '../entities/user_coupon.entity';

@ObjectType()
export class UserCouponPaginationResultOutput {
  @Field(() => [Coupon])
  items: UserCoupon[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
