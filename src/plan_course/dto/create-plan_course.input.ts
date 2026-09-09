import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreatePlanCourseInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  plan_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  rate: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  price_after_discount?: number;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  course_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  content_id?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
