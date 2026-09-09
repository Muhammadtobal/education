import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentItemType } from 'src/shared/enums/payment_item_type.enum';

@InputType()
export class CreatePaymentInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  payment_code: string;

  @IsNotEmpty()
  @IsEnum(PaymentItemType)
  @Field(() => PaymentItemType)
  payment_item_type: PaymentItemType;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  course_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  plan_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  content_id?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  value?: number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  code?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
