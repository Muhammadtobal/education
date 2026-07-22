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
export class CreatePlanCourseInput {

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  plan_id: string;


  @IsNotEmpty()
  @IsNumberString()
  @Field()
  course_id: string;

}