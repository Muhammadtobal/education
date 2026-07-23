import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

import { Direction } from 'src/shared/enums/direction.enum';

@InputType()
export class CreateExamInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  course_id: string;

  @IsNotEmpty()
  @IsEnum(Direction)
  @Field(() => Direction)
  direction: Direction;

  @IsNotEmpty()
  @Field(() => Date)
  exam_date: Date;

  @IsOptional()
  @IsInt()
  @Field(() => Int, { nullable: true })
  exam_duration?: number;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
