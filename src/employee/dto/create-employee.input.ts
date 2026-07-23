import { InputType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

import { Gender } from 'src/shared/enums/gender.enum';

@InputType()
export class CreateEmployeeInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  phone: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  @Field(() => Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  @Field()
  full_name: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  city_id: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  active?: boolean;

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
}
