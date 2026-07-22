import { IsNotEmpty, IsNumberString } from "class-validator";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";

import { CreateCityInput } from "./create-city.input";

@InputType()
export class UpdateCityInput extends PartialType(CreateCityInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}
