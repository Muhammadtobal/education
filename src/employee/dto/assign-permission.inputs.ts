import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString } from "class-validator";

@InputType()
export class AssignPermissionInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  permission_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  employee_id: string;
}
