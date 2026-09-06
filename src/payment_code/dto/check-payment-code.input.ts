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

@InputType()
export class CheckActivationPaymentCodeInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  code: string;

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
