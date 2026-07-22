import { InputType, Int, Field } from "@nestjs/graphql";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class CreateCityInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
