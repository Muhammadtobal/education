import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsNumber,
} from 'class-validator';

@InputType()
export class CreateExamUserInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  exam_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  user_id: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  mark?: number;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
