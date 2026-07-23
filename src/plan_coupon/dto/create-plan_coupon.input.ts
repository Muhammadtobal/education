import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreatePlanCouponInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  coupon_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  plan_id: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
