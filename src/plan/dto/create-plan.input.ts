import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreatePlanCourseFirstInput } from 'src/plan_course/dto/create-paln_course_first.input';
import { CreatePlanCourseInput } from 'src/plan_course/dto/create-plan_course.input';

import { PlanType } from 'src/shared/enums/plan_type.enum';

@InputType()
export class CreatePlanInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsOptional()
  @IsInt()
  @Field(() => Int, { nullable: true })
  count_days?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  price?: number;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;

  @ValidateNested({ each: true })
  @Type(() => CreatePlanCourseFirstInput)
  @Field(() => [CreatePlanCourseFirstInput], { nullable: true })
  plan_courses?: CreatePlanCourseFirstInput[];
}
