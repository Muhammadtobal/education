import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenShowContentOutput {
  @Field()
  playback_url: string;

  @Field()
  expires_in: number;
}
