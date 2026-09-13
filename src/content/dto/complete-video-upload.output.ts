import { ObjectType, Field } from '@nestjs/graphql';
import { VideoAsset } from '../entities/video_asset.entity';

@ObjectType()
export class CompleteVideoUploadOutput {
  @Field(() => VideoAsset)
  video_asset: VideoAsset;
}
