import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateCourseTeacherInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  teacher_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  course_id: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  teacher_share?: number;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  active?: boolean;
}
