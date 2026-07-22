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
export class CreateEmployeeVendorInput {

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  vendor_id: string;


  @IsNotEmpty()
  @IsNumberString()
  @Field()
  employee_id: string;


  @IsNotEmpty()
  @IsNumberString()
  @Field()
  level_id: string;

}