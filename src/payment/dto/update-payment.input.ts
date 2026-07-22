import { InputType, Field, PartialType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { CreatePaymentInput } from "./create-payment.input";

@InputType()
export class UpdatePaymentInput extends PartialType(CreatePaymentInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}