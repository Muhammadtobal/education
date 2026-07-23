import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Teacher } from 'src/teacher/entities/teacher.entity';

@ObjectType()
export class CheckActivationTeacherCodeOutput {
  @Field(() => Teacher, { nullable: true })
  teacher?: Teacher;

  @Field({ nullable: true })
  access_token?: string;

  @Field({ nullable: true })
  refresh_token?: string;

  @Field(() => Int, { nullable: true })
  expires_in?: number;
}
