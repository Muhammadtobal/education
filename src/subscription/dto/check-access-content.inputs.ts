import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

@InputType()
export class CheckContentAccessInput {
  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  content_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  course_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  plan_id?: string;
}
