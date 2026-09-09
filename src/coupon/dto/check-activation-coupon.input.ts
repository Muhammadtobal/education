import { InputType, Int, Field, Float } from '@nestjs/graphql';
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
} from 'class-validator';
import { DiscountType } from 'src/shared/enums/discount_type.enum';
import { PaymentItemType } from 'src/shared/enums/payment_item_type.enum';

@InputType()
export class CheckActivationCouponInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  code: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  plan_id?: string;

  @IsNotEmpty()
  @IsEnum(PaymentItemType)
  @Field(() => PaymentItemType)
  type: PaymentItemType;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  course_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  content_id?: string;
}
