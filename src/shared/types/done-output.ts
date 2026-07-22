import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DoneResponseOutput {
  @Field(() => Boolean)
  done: boolean;
}
