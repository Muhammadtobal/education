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

import GraphQLJSON from 'graphql-type-json';
import { Gender } from 'src/shared/enums/gender.enum';

@InputType()
export class CreateTeacherInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  @Field(() => Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  city_id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  phone: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  balance?: number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  description?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  image_url?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  rating?: number;

  @IsOptional()
  @Field(() => GraphQLJSON, { nullable: true })
  device_info?: Record<string, any>;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  fcm_token?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  refresh_token?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
