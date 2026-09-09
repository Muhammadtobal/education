import { InputType, Field, PartialType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumberString } from "class-validator";
import { CreateBannerInput } from "./create-banner.input";

@InputType()
export class UpdateBannerInput extends PartialType(CreateBannerInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}