import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { EmployeePermissionService } from "./employee_permission.service";
import { EmployeePermission } from "./entities/employee_permission.entity";
import { CreateEmployeePermissionInput } from "./dto/create-employee_permission.input";
import { UpdateEmployeePermissionInput } from "./dto/update-employee_permission.input";

@Resolver(() => EmployeePermission)
export class EmployeePermissionResolver {
  constructor(
    private readonly employeePermissionService: EmployeePermissionService,
  ) {}
}
