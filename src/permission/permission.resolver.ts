import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { PermissionPaginationResultOutput } from './dto/find-all-permission.output';
import { FindAllPermissionInput } from './dto/find-all-permission.input';
import { DoneResponseOutput } from 'src/shared/types/done-output';
import { JwtAuthEmployeeGuard } from 'src/auth/guards/jwt-auth-employee.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';
@Resolver(() => Permission)
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Mutation(() => Permission)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.CREATE + Permission.name)
  public createPermission(
    @Args('createPermissionInput') createPermissionInput: CreatePermissionInput,
  ) {
    return this.permissionService.create(createPermissionInput);
  }

  @Query(() => PermissionPaginationResultOutput, { name: 'permissions' })
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.GET + Permission.name)
  public findAll(@Args('filter') filter: FindAllPermissionInput) {
    return this.permissionService.findAll(filter);
  }

  @Query(() => Permission, { name: 'permission' })
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.GET + Permission.name)
  public findOne(@Args('id') id: string) {
    return this.permissionService.findOne({ id });
  }

  @Mutation(() => Permission)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.UPDATE + Permission.name)
  public updatePermission(
    @Args('updatePermissionInput') updatePermissionInput: UpdatePermissionInput,
  ) {
    return this.permissionService.update(updatePermissionInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.DELETE + Permission.name)
  public removePermission(@Args('id') id: string) {
    this.permissionService.remove(id);
    return {
      done: true,
    };
  }
}
