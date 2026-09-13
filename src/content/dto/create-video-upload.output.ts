import { ObjectType, Field } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

import { VideoAsset } from '../entities/video_asset.entity';

@ObjectType()
export class CreateVideoUploadOutput {
  @Field()
  video_asset_id: string;

  @Field()
  provider: string;

  @Field()
  provider_public_id: string;

  @Field()
  upload_method: string;

  @Field()
  upload_url: string;

  @Field(() => GraphQLJSON, { nullable: true })
  upload_headers?: Record<string, string>;

  @Field({ nullable: true })
  object_key?: string;

  @Field({ nullable: true })
  public_id?: string;

  @Field(() => VideoAsset)
  video_asset: VideoAsset;
}
