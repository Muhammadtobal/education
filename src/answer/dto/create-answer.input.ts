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
export class CreateAnswerInput {

  @IsNotEmpty()
  @IsString()
  @Field( )
  name: string;


  @IsNotEmpty()
  @IsNumberString()
  @Field()
  question_id: string;

}