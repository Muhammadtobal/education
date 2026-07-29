import { Injectable } from '@nestjs/common';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateEmployeeInput } from './dto/create-employee.input';
import { UpdateEmployeeInput } from './dto/update-employee.input';
import { Employee } from './entities/employee.entity';
import {
  customPaginate,
  generateQueryConditions,
  generateQuerySorts,
  metaTransformer,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { FindAllEmployeeInput } from './dto/find-all-employee.input';
import { PermissionService } from 'src/permission/permission.service';
import { AssignPermissionInput } from './dto/assign-permission.inputs';
import { EmployeePermissionService } from 'src/employee_permission/employee_permission.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly employeePermissionService: EmployeePermissionService,
    private readonly permissionService: PermissionService,
  ) {}
  public create(createEmployeeInput: CreateEmployeeInput) {
    const employee = this.employeeRepository.create(createEmployeeInput);
    return this.employeeRepository.save(employee);
  }

  public findAll(filter: FindAllEmployeeInput) {
    const query = this.employeeRepository
      .createQueryBuilder('employee')

      .where('true');
    generateQuerySorts<Employee>(query, filter, Employee, 'employee');

    generateQueryConditions<Employee>(query, filter, 'employee');

    return customPaginate<Employee, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    employeeOptions: FindOptionsWhere<Employee>,
    options?: {
      selected?: FindOptionsSelect<Employee>;
      relations?: FindOptionsRelations<Employee>;
    },
  ) {
    return this.employeeRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: employeeOptions,
    });
  }
  public async update(updateEmployeeInput: UpdateEmployeeInput) {
    await this.employeeRepository.update(
      { id: updateEmployeeInput.id },
      updateEmployeeInput,
    );
    return this.findOne(
      { id: updateEmployeeInput.id },
      {
        relations: { employee_permissions: true },
      },
    );
  }

  public async assignPermission(assignPermissionInput: AssignPermissionInput) {
    const employee = await this.findOne({
      id: assignPermissionInput.employee_id,
    });

    if (!employee) {
      return false;
    }

    await Promise.all(
      assignPermissionInput.permission_ids.map((permissionId) =>
        this.permissionService.findOne({ id: permissionId }),
      ),
    );

    await Promise.all(
      assignPermissionInput.permission_ids.map((permissionId) =>
        this.employeePermissionService.create({
          employee_id: assignPermissionInput.employee_id,
          permission_id: permissionId,
        }),
      ),
    );

    return true;
  }
  public async unassignPermission(
    unassignPermissionInput: AssignPermissionInput,
  ) {
    const employee = await this.findOne({
      id: unassignPermissionInput.employee_id,
    });

    if (!employee) {
      return false;
    }

    await Promise.all(
      unassignPermissionInput.permission_ids.map((permissionId) =>
        this.permissionService.findOne({ id: permissionId }),
      ),
    );

    await Promise.all(
      unassignPermissionInput.permission_ids.map((permissionId) =>
        this.employeePermissionService.remove({
          employee_id: unassignPermissionInput.employee_id,
          permission_id: permissionId,
        }),
      ),
    );

    return true;
  }
  public findAllRaw(
    employeeOptions: FindOptionsWhere<Employee>,
    options?: {
      selected?: FindOptionsSelect<Employee>;
      relations?: FindOptionsRelations<Employee>;
    },
  ) {
    return this.employeeRepository.find({
      select: options?.selected,
      relations: options?.relations,
      where: employeeOptions,
    });
  }
}
