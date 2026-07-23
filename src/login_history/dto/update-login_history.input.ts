import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { CreateLoginHistoryInput } from './create-login_history.input';

@InputType()
export class UpdateLoginHistoryInput extends PartialType(
  CreateLoginHistoryInput,
) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}
