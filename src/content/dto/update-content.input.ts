import { InputType, Field, PartialType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { CreateContentInput } from "./create-content.input";

@InputType()
export class UpdateContentInput extends PartialType(CreateContentInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}