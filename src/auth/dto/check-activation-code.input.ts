import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class CheckActivationCodeInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  code: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  fcm_token?: string;
}
