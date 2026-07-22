import { InputType, Field, PartialType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { CreateLevelInput } from "./create-level.input";

@InputType()
export class UpdateLevelInput extends PartialType(CreateLevelInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}