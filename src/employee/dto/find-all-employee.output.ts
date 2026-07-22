import { Field, ObjectType } from "@nestjs/graphql";
import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import { Employee } from "../entities/employee.entity";

@ObjectType()
export class EmployeePaginationResultOutput {
  @Field(() => [Employee])
  items: Employee[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
