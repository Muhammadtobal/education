import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CompleteMediaAssetUploadInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  media_asset_id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  provider_public_id: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  secure_url?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  duration_seconds?: number;
  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  size_bytes?: number;
  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  width?: number;
  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  height?: number;

  @IsOptional()
  @IsObject()
  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: Record<string, any>;
}
