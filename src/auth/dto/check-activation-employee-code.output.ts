import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Employee } from 'src/employee/entities/employee.entity';

@ObjectType()
export class CheckActivationEmployeeCodeOutput {
  @Field(() => Employee, { nullable: true })
  employee?: Employee;

  @Field({ nullable: true })
  access_token?: string;

  @Field({ nullable: true })
  refresh_token?: string;

  @Field(() => Int, { nullable: true })
  expires_in?: number;
}
