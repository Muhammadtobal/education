import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsObject } from "class-validator";
import GraphQLJSON from "graphql-type-json";

@InputType()
export class CreateConstantInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  key: string;

  @IsNotEmpty()
  @IsObject()
  @Field(() => GraphQLJSON)
  value: Record<string, any>;
}
