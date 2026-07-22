import { InputType, Field, PartialType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { CreateReviewInput } from "./create-review.input";

@InputType()
export class UpdateReviewInput extends PartialType(CreateReviewInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}