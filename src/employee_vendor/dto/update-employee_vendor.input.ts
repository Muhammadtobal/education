import { InputType, Field, PartialType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { CreateEmployeeVendorInput } from "./create-employee_vendor.input";

@InputType()
export class UpdateEmployeeVendorInput extends PartialType(CreateEmployeeVendorInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}