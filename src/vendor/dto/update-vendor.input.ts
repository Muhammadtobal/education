import { InputType, Field, PartialType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { CreateVendorInput } from "./create-vendor.input";

@InputType()
export class UpdateVendorInput extends PartialType(CreateVendorInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}