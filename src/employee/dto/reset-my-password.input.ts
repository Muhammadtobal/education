import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from "class-validator";

@InputType()
export class ResetMyPasswordInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  new_password: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  current_password: string;
}
