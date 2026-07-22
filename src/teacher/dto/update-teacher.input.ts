import { InputType, Field, PartialType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { CreateTeacherInput } from "./create-teacher.input";

@InputType()
export class UpdateTeacherInput extends PartialType(CreateTeacherInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}