import { IsNotEmpty, IsNumberString, IsString } from "class-validator";
import { CreateConstantInput } from "./create-constant.input";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateConstantInput extends PartialType(CreateConstantInput) {
  @IsNotEmpty()
  @IsString()
  @Field()
  key: string;
}
