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
import { Direction } from 'src/shared/enums/direction.enum';

@InputType()
export class CreateAnswerInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  question_id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  answer_text: string;

  @IsNotEmpty()
  @IsEnum(Direction)
  @Field(() => Direction)
  direction: Direction;

  @IsNotEmpty()
  @IsBoolean()
  @Field()
  is_true: boolean;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  hint_text?: string;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true, defaultValue: true })
  active?: boolean;
}
