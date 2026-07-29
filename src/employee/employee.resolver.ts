import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';

import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';
import { EmployeePaginationResultOutput } from './dto/find-all-employee.output';
import { FindAllEmployeeInput } from './dto/find-all-employee.input';
import { AuthService } from 'src/auth/auth.service';
import { GqlContext } from 'src/shared/types/context';
import { getEmpId } from 'src/shared/helpers';
import { DoneResponseOutput } from 'src/shared/types/done-output';
import { AssignPermissionInput } from './dto/assign-permission.inputs';
import { JwtAuthEmployeeGuard } from 'src/auth/guards/jwt-auth-employee.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';
import { ResetMyPasswordInput } from './dto/reset-my-password.input';
import { ErrorMessages } from 'src/shared/error-messages.object';
import { CheckActivationEmployeeCodeOutput } from 'src/auth/dto/check-activation-employee-code.output';
import { UserService } from 'src/user/user.service';
@Resolver(() => Employee)
export class EmployeeResolver {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => CheckActivationEmployeeCodeOutput)
  public async createEmployee(
    @Args('createEmployeeInput')
    createEmployeeInput: CreateEmployeeInput,
  ) {
    const oldEmployee = await this.employeeService.findOne({
      phone: createEmployeeInput.phone,
    });

    if (oldEmployee)
      throw new HttpException(
        ErrorMessages.USER_EXISTS_CONFLICT,
        HttpStatus.CONFLICT,
      );

    const activationCode = await this.userService.findOneActivationCode({
      phone: createEmployeeInput.phone,
    });

    if (!activationCode || activationCode.code !== 'passed')
      throw new HttpException(
        ErrorMessages.ACTIVATION_CODE_UNAUTHORIZED,
        HttpStatus.CONFLICT,
      );

    const refreshToken = await this.authService.generateRefreshToken();

    const employee = await this.employeeService.create({
      ...createEmployeeInput,
      refresh_token: refreshToken,
    });

    const accessToken = await this.authService.generateJwtToken(
      { empId: employee.id },
      process.env.EMPLOYEE_JWT_KEY as string,
    );

    this.userService.removeActivationCode(activationCode.id);

    return {
      employee: { ...employee },
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 15 * 60,
    };
  }
  @Query(() => EmployeePaginationResultOutput, { name: 'employees' })
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.GET + Employee.name)
  public findAll(@Args('filter') filter: FindAllEmployeeInput) {
    return this.employeeService.findAll(filter);
  }

  @Query(() => Employee, { name: 'employee' })
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.GET + Employee.name)
  public findOne(@Args('id') id: string) {
    return this.employeeService.findOne(
      { id },
      {
        relations: { employee_permissions: { permission: true } },
      },
    );
  }

  @Query(() => Employee, { name: 'myEmployeeProfile', nullable: true })
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.GET + Employee.name)
  public findEmployeeProfile(@Context() context: GqlContext) {
    return this.employeeService.findOne(
      { id: getEmpId(context.req.user) },
      {
        relations: { employee_permissions: { permission: true } },
      },
    );
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.UPDATE + Employee.name)
  public async assignPermission(
    @Args('assignPermissionInput') assignPermissionInput: AssignPermissionInput,
  ) {
    const result = await this.employeeService.assignPermission(
      assignPermissionInput,
    );

    return { done: result };
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.UPDATE + Employee.name)
  public async unassignPermission(
    @Args('unassignPermissionInput')
    unassignPermissionInput: AssignPermissionInput,
  ) {
    const result = await this.employeeService.unassignPermission(
      unassignPermissionInput,
    );

    return { done: result };
  }

  // @Mutation(() => DoneResponseOutput)
  // @Permissions(Operation.UPDATE + Employee.name)
  // @UseGuards(JwtAuthEmployeeGuard)
  // public async resetMyPassword(
  //   @Args('resetMyPasswordInput') resetMyPasswordInput: ResetMyPasswordInput,
  //   @Context() context: GqlContext,
  // ) {
  //   const emp = await this.employeeService.findOne({
  //     id: getEmpId(context.req.user),
  //   });
  //   if (!emp)
  //     throw new HttpException(
  //       ErrorMessages.NOT_FOUND_EMPLOYEE,
  //       HttpStatus.NOT_FOUND,
  //     );

  //   if (
  //     !(await bcrypt.compare(
  //       resetMyPasswordInput.current_password,
  //       emp.password,
  //     ))
  //   )
  //     throw new HttpException(
  //       ErrorMessages.EMPLOYEE_DATA_CONFLICT,
  //       HttpStatus.CONFLICT,
  //     );

  //   const newHashedPassword = await bcrypt.hash(
  //     resetMyPasswordInput.new_password,
  //     10,
  //   );

  //   await this.employeeService.update({
  //     id: getEmpId(context.req.user),
  //     password: newHashedPassword,
  //   });

  //   return { done: true };
  // }
}
