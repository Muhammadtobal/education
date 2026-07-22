import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class SendActivationCodeInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  phone: string;

  @IsOptional() 
  @IsString()
  @Field({ nullable: true })
  autofill_code?: string;
}