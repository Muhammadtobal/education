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
export class CreateCourseInput {

  @IsNotEmpty()
  @IsString()
  @Field( )
  name: string;


  @IsNotEmpty()
  @IsNumberString()
  @Field()
  level_id: string;


  @IsNotEmpty()
  @IsNumberString()
  @Field()
  teacher_id: string;

}