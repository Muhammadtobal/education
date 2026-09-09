import { InputType, Int, Field, Float } from "@nestjs/graphql";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsDecimal,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator";

@InputType()
export class CreateBannerInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  image_url: string;

  @IsNotEmpty()
  @IsDateString()
  @Field()
  start_date: string;

  @IsNotEmpty()
  @IsDateString()
  @Field()
  end_date: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  title?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  subtitle?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  action_url?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  action_type?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  sort_order?: number;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
