import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { EmployeeVendorService } from './employee_vendor.service';
import { EmployeeVendor } from './entities/employee_vendor.entity';

import { CreateEmployeeVendorInput } from './dto/create-employee_vendor.input';
import { UpdateEmployeeVendorInput } from './dto/update-employee_vendor.input';
import { FindAllEmployeeVendorInput } from './dto/find-all-employee_vendor.input';
import { EmployeeVendorPaginationResultOutput } from './dto/find-all-employee_vendor.output';

import { DoneResponseOutput } from 'src/shared/types/done-output';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';

@Resolver(() => EmployeeVendor)
export class EmployeeVendorResolver {
  constructor(private readonly employeeVendorService: EmployeeVendorService) {}

  @Mutation(() => EmployeeVendor)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + EmployeeVendor.name)
  public createEmployeeVendor(
    @Args('createEmployeeVendorInput')
    createEmployeeVendorInput: CreateEmployeeVendorInput,
  ) {
    return this.employeeVendorService.create(createEmployeeVendorInput);
  }

  @Query(() => EmployeeVendorPaginationResultOutput, {
    name: 'employee_vendors',
  })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + EmployeeVendor.name)
  public findAll(@Args('filter') filter: FindAllEmployeeVendorInput) {
    return this.employeeVendorService.findAll(filter);
  }

  @Query(() => EmployeeVendor, { name: 'employee_vendor' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + EmployeeVendor.name)
  public findOne(@Args('id') id: string) {
    return this.employeeVendorService.findOne({ id });
  }

  @Mutation(() => EmployeeVendor)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + EmployeeVendor.name)
  public updateEmployeeVendor(
    @Args('updateEmployeeVendorInput')
    updateEmployeeVendorInput: UpdateEmployeeVendorInput,
  ) {
    return this.employeeVendorService.update(updateEmployeeVendorInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + EmployeeVendor.name)
  public removeEmployeeVendor(@Args('id') id: string) {
    this.employeeVendorService.remove(id);

    return {
      done: true,
    };
  }
}
