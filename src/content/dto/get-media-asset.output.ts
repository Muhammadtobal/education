import { Field, ObjectType } from '@nestjs/graphql';

import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  MediaAssetType,
  MediaProvider,
} from 'src/shared/enums/media_asset.enum';

@ObjectType()
export class MediaAssetAccessOutput {
  @IsNotEmpty()
  @IsString()
  @Field()
  content_id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  media_asset_id: string;

  @IsNotEmpty()
  @Field(() => MediaAssetType)
  type: MediaAssetType;

  @IsNotEmpty()
  @Field(() => MediaProvider)
  provider: MediaProvider;

  @IsNotEmpty()
  @IsString()
  @Field()
  access_url: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  file_name?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  mime_type?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  size_bytes?: string;

  @IsNotEmpty()
  @IsBoolean()
  @Field()
  is_pdf: boolean;
}
