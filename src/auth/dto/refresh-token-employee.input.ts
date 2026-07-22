import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class RefreshTokenEmployeeInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  refresh_token: string;
}
