import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsNumberString,
  IsEmpty,
  IsDate,
} from 'class-validator';
import { GraphQLJSON } from 'graphql-type-json';

import { Gender } from 'src/shared/enums/gender.enum';

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  phone: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  @Field(() => Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  city_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  level_id: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  img_url?: string;

  @IsOptional()
  @Field(() => GraphQLJSON, { nullable: true })
  device_info?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  fcm_token?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  lang?: string;

  @IsEmpty()
  refresh_token?: string;
}
