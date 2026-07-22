import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { EmployeeVendorService } from "./employee_vendor.service";
import { EmployeeVendor } from "./entities/employee_vendor.entity";
import { CreateEmployeeVendorInput } from "./dto/create-employee_vendor.input";
import { UpdateEmployeeVendorInput } from "./dto/update-employee_vendor.input";
import { EmployeeVendorPaginationResultOutput } from "./dto/find-all-employee_vendor.output";
import { FindAllEmployeeVendorInput } from "./dto/find-all-employee_vendor.input";
import { DoneResponseOutput } from "src/shared/types/done-output";

@Resolver(() => EmployeeVendor)
export class EmployeeVendorResolver {
  constructor(private readonly employeeVendorService: EmployeeVendorService) {}

  @Mutation(() => EmployeeVendor)
  public createEmployeeVendor(
    @Args("createEmployeeVendorInput") createEmployeeVendorInput: CreateEmployeeVendorInput,
  ) {
    return this.employeeVendorService.create(createEmployeeVendorInput);
  }

  @Query(() => EmployeeVendorPaginationResultOutput, { name: "employeeVendors" })
  public findAll(@Args("filter") filter: FindAllEmployeeVendorInput) {
    return this.employeeVendorService.findAll(filter);
  }

  @Query(() => EmployeeVendor, { name: "employeeVendor" })
  public findOne(@Args("id") id: string) {
    return this.employeeVendorService.findOne({ id });
  }

  @Mutation(() => EmployeeVendor)
  public updateEmployeeVendor(
    @Args("updateEmployeeVendorInput") updateEmployeeVendorInput: UpdateEmployeeVendorInput,
  ) {
    return this.employeeVendorService.update(updateEmployeeVendorInput);
  }

  @Mutation(() => DoneResponseOutput)
  public removeEmployeeVendor(@Args("id") id: string) {
    this.employeeVendorService.remove(id);
    return { done: true };
  }
}