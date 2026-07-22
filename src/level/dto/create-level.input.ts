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
export class CreateLevelInput {

  @IsNotEmpty()
  @IsString()
  @Field( )
  name: string;


  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean , { nullable: true })
  active?: boolean;

}