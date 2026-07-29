import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsNumberString } from 'class-validator';

@InputType()
export class AssignPermissionInput {
  @IsNotEmpty()
  @Field(() => [String])
  permission_ids: string[];

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  employee_id: string;
}
