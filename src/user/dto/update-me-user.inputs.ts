import { InputType, Field } from "@nestjs/graphql";
import {
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsNumberString,
} from "class-validator";
import { GraphQLJSON } from "graphql-type-json";
import { Gender } from "src/shared/enums/gender.enum";

@InputType()
export class UpdateMeUserInput {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  full_name?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  phone?: string;

  @IsOptional()
  @IsEnum(Gender)
  @Field(() => Gender, { nullable: true })
  gender?: Gender;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  img_url?: string;

  @IsOptional()
  @Field(() => GraphQLJSON, { nullable: true })
  device_info?: Record<string, any>;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  fcm_token?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  lang?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  city_id?: string;
}
