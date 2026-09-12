import { InputType, Field, Float } from '@nestjs/graphql';

import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CompleteVideoUploadInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  video_asset_id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  provider_public_id: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  secure_url?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  playback_url?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  duration_seconds?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  size_bytes?: number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  format?: string;

  @IsOptional()
  @IsObject()
  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: Record<string, any>;
}
