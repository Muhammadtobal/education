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
export class CreateMediaAssetUploadInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  content_id: string;

  @IsNotEmpty()
  @IsEnum(MediaAssetType)
  @Field(() => MediaAssetType)
  type: MediaAssetType;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  file_name?: string;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Float)
  size_bytes: number;

  @IsNotEmpty()
  @IsString()
  @Field()
  mime_type: string;
}
