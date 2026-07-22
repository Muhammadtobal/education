import { InputType, Int, Field, Float } from "@nestjs/graphql";
import {
  IsArray,
  IsBoolean,
  IsDecimal,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator";

@InputType()
export class CreatePlanCouponInput {

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Float )
  value: number;


  @IsNotEmpty()
  @IsNumberString()
  @Field()
  coupon_id: string;


  @IsNotEmpty()
  @IsNumberString()
  @Field()
  plan_id: string;

}