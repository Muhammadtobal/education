import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { MediaAsset } from '../entities/media_asset.entity';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

@ObjectType()
export class CreateMediaAssetUploadOutput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  media_asset_id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  provider: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  provider_public_id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  upload_method: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  upload_url: string;

  @IsOptional()
  @IsObject()
  @Field(() => GraphQLJSON, { nullable: true })
  upload_headers?: Record<string, any>;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  object_key?: string;

  @IsNotEmpty()
  @IsString()
  @Field({ nullable: true })
  public_id?: string;

  @IsNotEmpty()
  @IsEnum(MediaAsset)
  @Field(() => MediaAsset)
  media_asset: MediaAsset;
}
