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
  @IsNumberString()
  @Field()
  vendor_id: string;

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
  review_count?: number;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  active?: boolean;
}
