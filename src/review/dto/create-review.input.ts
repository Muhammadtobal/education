import { InputType, Int, Field, Float } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDecimal,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateReviewInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  video_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  user_id: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  comment?: string;
}
