import { InputType, Field, PartialType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { CreateQuestionInput } from "./create-question.input";

@InputType()
export class UpdateQuestionInput extends PartialType(CreateQuestionInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}