import { InputType, Int, Field, Float } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDecimal,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateAnswerUserInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  exam_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  answer_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  question_id: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
