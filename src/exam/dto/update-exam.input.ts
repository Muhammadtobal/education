import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { CreateExamInput } from './create-exam.input';

@InputType()
export class UpdateExamInput extends PartialType(CreateExamInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}
