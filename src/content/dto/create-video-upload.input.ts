import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateVideoUploadInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  content_id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  file_name: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  mime_type: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  size_bytes?: number;
}
