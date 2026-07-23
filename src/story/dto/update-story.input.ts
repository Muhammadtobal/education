import { InputType, Field, PartialType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { CreateStoryInput } from "./create-story.input";

@InputType()
export class UpdateStoryInput extends PartialType(CreateStoryInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}