import { IsNotEmpty, IsNumberString } from "class-validator";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";

import { CreateEmployeeInput } from "./create-employee.input";

@InputType()
export class UpdateEmployeeInput extends PartialType(CreateEmployeeInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}
