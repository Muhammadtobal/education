import { InputType, Int, Field, Float } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDecimal,
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateTeacherInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  phone: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  vendor_id: string;

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
  count_review?: number;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;

  @IsOptional()
  @Field(() => GraphQLJSON, { nullable: true })
  device_info?: Record<string, any>;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  fcm_token?: string;

  @IsEmpty()
  refresh_token: string;
}
