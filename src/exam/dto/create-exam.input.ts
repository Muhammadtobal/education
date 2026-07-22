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
export class CreateExamInput {

  @IsNotEmpty()
  @IsString()
  @Field( )
  name: string;


  @IsNotEmpty()
  @IsNumberString()
  @Field()
  course_id: string;

}