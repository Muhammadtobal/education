import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class TeacherStaticsOutput {
  @Field(() => Int)
  totalStudents: number;

  @Field(() => Int)
  totalCourses: number;

  @Field(() => Int)
  totalVendors: number;

  @Field(() => Int)
  balance: number;
}
