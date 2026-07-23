import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { CreateCouponInput } from './create-coupon.input';
import { CreateUserCouponInput } from './create-user_coupon.input';

@InputType()
export class UpdateUserCouponInput extends PartialType(CreateUserCouponInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}
