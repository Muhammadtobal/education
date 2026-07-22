import { InputType, Int, Field, Float } from "@nestjs/graphql";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDecimal,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator";
import { DiscountType } from "src/shared/enums/discount_type.enum";

@InputType()
export class CreateUserCouponInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  user_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  coupon_id: string;
}
