import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from "typeorm";
import { paginate } from "nestjs-typeorm-paginate";

import { CreateEmployeePermissionInput } from "./dto/create-employee_permission.input";
import { UpdateEmployeePermissionInput } from "./dto/update-employee_permission.input";
import { EmployeePermission } from "./entities/employee_permission.entity";
import { FindAllEmployeePermissionInput } from "./dto/find-all-employee_permission.input";
import {
  customPaginate,
  generateQueryConditions,
  generateQuerySorts,
  metaTransformer,
} from "src/shared/helpers";
import { PaginationMetadata } from "src/shared/types/pagination-metadata";

@Injectable()
export class EmployeePermissionService {
  constructor(
    @InjectRepository(EmployeePermission)
    private readonly employeePermissionRepository: Repository<EmployeePermission>,
  ) {}
  public create(createEmployeePermissionInput: CreateEmployeePermissionInput) {
    const employeePermission = this.employeePermissionRepository.create(
      createEmployeePermissionInput,
    );
    return this.employeePermissionRepository.save(employeePermission);
  }

  public findAll(filter: FindAllEmployeePermissionInput) {
    const query = this.employeePermissionRepository
      .createQueryBuilder("employee_permission")
      .leftJoinAndSelect("employee_permission.permission", "permission")
      .leftJoinAndSelect("employee_permission.employee", "employee")
      .where("true");

    generateQuerySorts<EmployeePermission>(
      query,
      filter,
      EmployeePermission,
      "employee_permission",
    );

    generateQueryConditions<EmployeePermission>(
      query,
      filter,
      "employee_permission",
    );

    return customPaginate<EmployeePermission, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    employeePermissionOptions: FindOptionsWhere<EmployeePermission>,
    options?: {
      selected?: FindOptionsSelect<EmployeePermission>;
      relations?: FindOptionsRelations<EmployeePermission>;
    },
  ) {
    return this.employeePermissionRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: employeePermissionOptions,
    });
  }

  public async update(
    updateEmployeePermissionInput: UpdateEmployeePermissionInput,
  ) {
    await this.employeePermissionRepository.update(
      { id: updateEmployeePermissionInput.id },
      updateEmployeePermissionInput,
    );
    return this.findOne({ id: updateEmployeePermissionInput.id });
  }
  public async remove(
    employeePermissionOptions: FindOptionsWhere<EmployeePermission>,
  ) {
    await this.employeePermissionRepository.delete(employeePermissionOptions);
  }
}
