import { IsNotEmpty, IsNumberString } from 'class-validator';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

import { CreateEmployeePermissionInput } from './create-employee_permission.input';

@InputType()
export class UpdateEmployeePermissionInput extends PartialType(
  CreateEmployeePermissionInput,
) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}
