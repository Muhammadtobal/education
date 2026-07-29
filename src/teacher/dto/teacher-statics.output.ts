import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class TeacherStaticsOutput {
  @Field(() => Int)
  totalCourses: number;

  @Field(() => Int)
  totalSubscriptions: number;

  @Field(() => Int)
  totalStudents: number;
}
