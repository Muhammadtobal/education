import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
// import { User } from "src/user/entities/user.entity";

@ObjectType()
export class CheckActivationUserCodeOutput {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  access_token?: string;

  @Field({ nullable: true })
  refresh_token?: string;

  @Field(() => Int, { nullable: true })
  expires_in?: number;
}
