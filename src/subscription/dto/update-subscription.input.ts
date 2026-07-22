import { InputType, Field, PartialType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { CreateSubscriptionInput } from "./create-subscription.input";

@InputType()
export class UpdateSubscriptionInput extends PartialType(CreateSubscriptionInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}