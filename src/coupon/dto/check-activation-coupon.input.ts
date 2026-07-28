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
export class CheckActivationCouponInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  code: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  plan_id?: string;
}
