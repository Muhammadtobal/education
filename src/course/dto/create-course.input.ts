import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { CourseType } from 'src/shared/enums/course_type.enum';

@InputType()
export class CreateCourseInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  url: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  description: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  level_id: string;

  @IsNotEmpty()
  @IsEnum(CourseType)
  @Field(() => CourseType)
  course_type: CourseType;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  teacher_id: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  teacher_share?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  vendor_share?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  rating?: number;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  active?: boolean;
}
