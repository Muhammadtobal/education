import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { CreateCourseTeacherInput } from './create-course_teacher.input';

@InputType()
export class UpdateCourseTeacherInput extends PartialType(
  CreateCourseTeacherInput,
) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}
