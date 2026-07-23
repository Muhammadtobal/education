import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { EmployeePermission } from '../entities/employee_permission.entity';

@ObjectType()
export class EmployeePermissionPaginationResultOutput {
  @Field(() => [EmployeePermission])
  items: EmployeePermission[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
