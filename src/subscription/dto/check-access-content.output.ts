import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CheckAccessOutput {
  @Field(() => Boolean)
  allowed: boolean;

  @Field({ nullable: true })
  reason?: string;

  @Field({ nullable: true })
  subscription_id?: string;
}
