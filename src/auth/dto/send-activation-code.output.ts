import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SendActivationCodeOutput {
  @Field()
  sent: boolean;

  @Field({ nullable: true })
  code?: string;
}