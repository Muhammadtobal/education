import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RefreshTokenOutput {
  @Field()
  access_token: string;

  @Field(() => Int)
  expires_in: number;
}