import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { CreatePlanCourseInput } from './create-plan_course.input';

@InputType()
export class UpdatePlanCourseInput extends PartialType(CreatePlanCourseInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}
