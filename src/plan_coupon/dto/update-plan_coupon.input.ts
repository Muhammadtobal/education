import { InputType, Field, PartialType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { CreatePlanCouponInput } from "./create-plan_coupon.input";

@InputType()
export class UpdatePlanCouponInput extends PartialType(CreatePlanCouponInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}