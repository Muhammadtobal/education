import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateVendorInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  icon?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lang?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  img_url?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  fcm_token?: string;

  @IsOptional()
  @IsString()
  refresh_token?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsObject()
  device_info?: Record<string, any>;
}
