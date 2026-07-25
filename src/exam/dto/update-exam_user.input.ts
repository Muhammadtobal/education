import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { CreateExamInput } from './create-exam.input';
import { CreateExamUserInput } from './create-exam_user.input';

@InputType()
export class UpdateExamUserInput extends PartialType(CreateExamUserInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}
