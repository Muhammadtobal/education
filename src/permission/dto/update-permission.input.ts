import { IsNotEmpty, IsNumberString } from "class-validator";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";

import { CreatePermissionInput } from "./create-permission.input";

@InputType()
export class UpdatePermissionInput extends PartialType(CreatePermissionInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}
