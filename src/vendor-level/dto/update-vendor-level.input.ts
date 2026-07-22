import { InputType, Field, PartialType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { CreateVendorLevelInput } from "./create-vendor-level.input";

@InputType()
export class UpdateVendorLevelInput extends PartialType(CreateVendorLevelInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}