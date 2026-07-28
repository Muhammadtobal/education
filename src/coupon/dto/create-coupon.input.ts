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

@InputType()
export class CreateCouponInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  code: string;

  @IsNotEmpty()
  @IsEnum(DiscountType)
  @Field(() => DiscountType)
  discount_type: DiscountType;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  used_count: number;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Float)
  min_order_amount: number;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Float)
  discount_value: number;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active: boolean;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  description?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  usage_limit?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  max_discount: number;

  @IsOptional()
  @IsDate()
  @Field(() => Date, { nullable: true })
  starts_at?: Date;

  @IsOptional()
  @IsDate()
  @Field(() => Date, { nullable: true })
  expires_at?: Date;
}
