import { IsNotEmpty, IsNumberString } from "class-validator";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";

import { CreateNotificationInput } from "./create-notification.input";

@InputType()
export class UpdateNotificationInput extends PartialType(
  CreateNotificationInput,
) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}
