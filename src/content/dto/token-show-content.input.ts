import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumberString } from 'class-validator';

@InputType()
export class TokenShowContentInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  content_id: string;
}
