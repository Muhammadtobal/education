import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { MediaAssetType } from 'src/shared/enums/media_asset.enum';

@InputType()
export class FailMediaAssetUploadInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  media_asset_id: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  error_message?: string;
}
@InputType()
export class MediaAssetActionInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  media_asset_id: string;
}
