import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { CreateAnswerInput } from './create-answer.input';
import { CreateAnswerUserInput } from './create-answer-user.input';

@InputType()
export class UpdateAnswerUserInput extends PartialType(CreateAnswerUserInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}
