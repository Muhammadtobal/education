import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreatePaymentInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  course_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  user_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  vendor_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Float)
  value: number;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
