import { InputType, Field, Float, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsEnum,
  IsObject,
  IsNumber,
  IsInt,
} from 'class-validator';

import { ContentType } from 'src/shared/enums/content_type.enum';

@InputType()
export class CreateContentInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  course_id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  url: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  title: string;

  @IsNotEmpty()
  @IsBoolean()
  @Field(() => Boolean)
  is_free: boolean;

  @IsNotEmpty()
  @IsEnum(ContentType)
  @Field(() => ContentType)
  content_type: ContentType;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  parent_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  exam_id?: string;

  @IsOptional()
  @IsObject()
  @Field(() => GraphQLJSON, { nullable: true })
  content_info?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  price?: number;

  @IsOptional()
  @IsInt()
  @Field(() => Int, { nullable: true })
  count_day?: number;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  is_pdf?: boolean;
}
