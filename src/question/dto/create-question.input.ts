import { InputType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

import { Direction } from 'src/shared/enums/direction.enum';

@InputType()
export class CreateQuestionInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  question_text: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  exam_id: string;

  @IsNotEmpty()
  @IsEnum(Direction)
  @Field(() => Direction)
  direction: Direction;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  hint_text?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  parent_id?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
