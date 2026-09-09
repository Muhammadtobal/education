import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreatePlanCourseFirstInput {
  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  course_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  content_id?: string;

  @IsNumber()
  @Field(() => Float)
  rate: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  price_after_discount?: number;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
