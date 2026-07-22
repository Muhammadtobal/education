import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import {EmployeeVendor} from "../entities/employee_vendor.entity";

@ObjectType()
export class EmployeeVendorPaginationResultOutput {
  @Field(() => [EmployeeVendor])
  items: EmployeeVendor[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}