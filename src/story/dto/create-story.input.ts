import { InputType, Int, Field, Float } from "@nestjs/graphql";
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
} from "class-validator";

@InputType()
export class CreateStoryInput {

  @IsNotEmpty()
  @IsString()
  @Field( )
  url: string;


  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  level_id?: string;


  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  vendor_id?: string;

}