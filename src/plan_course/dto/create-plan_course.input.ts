import { InputType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreatePlanCourseInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  plan_id: string;

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
