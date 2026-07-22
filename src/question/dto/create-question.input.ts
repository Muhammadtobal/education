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
export class CreateQuestionInput {

  @IsNotEmpty()
  @IsString()
  @Field( )
  name: string;


  @IsNotEmpty()
  @IsNumberString()
  @Field()
  exam_id: string;

}