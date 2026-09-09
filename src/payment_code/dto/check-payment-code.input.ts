import { InputType, Int, Field, Float } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDecimal,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentItemType } from 'src/shared/enums/payment_item_type.enum';

@InputType()
export class CheckActivationPaymentCodeInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  code: string;

  @IsNotEmpty()
  @IsEnum(PaymentItemType)
  @Field(() => PaymentItemType)
  payment_item_type: PaymentItemType;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  plan_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  content_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  course_id?: string;
}
