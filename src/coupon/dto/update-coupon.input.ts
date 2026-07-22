import { InputType, Field, PartialType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { CreateCouponInput } from "./create-coupon.input";

@InputType()
export class UpdateCouponInput extends PartialType(CreateCouponInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}