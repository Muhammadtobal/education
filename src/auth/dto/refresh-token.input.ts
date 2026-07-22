import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class RefreshTokenInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  refresh_token: string;
}