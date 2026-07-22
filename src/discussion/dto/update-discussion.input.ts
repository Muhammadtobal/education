import { InputType, Field, PartialType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { CreateDiscussionInput } from "./create-discussion.input";

@InputType()
export class UpdateDiscussionInput extends PartialType(CreateDiscussionInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}