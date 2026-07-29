import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateEmployeeVendorInput } from './dto/create-employee_vendor.input';
import { UpdateEmployeeVendorInput } from './dto/update-employee_vendor.input';
import { EmployeeVendor } from './entities/employee_vendor.entity';
import { FindAllEmployeeVendorInput } from './dto/find-all-employee_vendor.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { PermissionService } from 'src/permission/permission.service';
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class EmployeeVendorService {
  constructor(
    @InjectRepository(EmployeeVendor)
    private readonly employeeVendorRepository: Repository<EmployeeVendor>,
    private readonly permissionService: PermissionService,
    private readonly employeeService: EmployeeService,
  ) {}
  public async create(createEmployeeVendorInput: CreateEmployeeVendorInput) {
    const employeeVendor = this.employeeVendorRepository.create(
      createEmployeeVendorInput,
    );

    const employeeVendorSaved =
      await this.employeeVendorRepository.save(employeeVendor);

    const permissions = await this.permissionService.findAll({
      pagination: { limit: 1000, page: 1 },
      active: true,
      for_vendor: true,
    });

    await this.employeeService.assignPermission({
      employee_id: createEmployeeVendorInput.employee_id,
      permission_ids: permissions.items.map((permission) => permission.id),
    });

    return employeeVendorSaved;
  }
  public findAll(filter: FindAllEmployeeVendorInput) {
    const query = this.employeeVendorRepository
      .createQueryBuilder('employee_vendor')
      .leftJoinAndSelect('employee_vendor.vendor', 'vendor')
      .leftJoinAndSelect('employee_vendor.vendor', 'employee')
      .where('true');
    generateQuerySorts<EmployeeVendor>(
      query,
      filter,
      EmployeeVendor,
      'employee_vendor',
    );
    generateQueryConditions<EmployeeVendor>(query, filter, 'employee_vendor');

    return customPaginate<EmployeeVendor, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    employeeVendorOptions: FindOptionsWhere<EmployeeVendor>,
    options?: {
      selected?: FindOptionsSelect<EmployeeVendor>;
      relations?: FindOptionsRelations<EmployeeVendor>;
    },
  ) {
    return this.employeeVendorRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: employeeVendorOptions,
    });
  }

  public async update(updateEmployeeVendorInput: UpdateEmployeeVendorInput) {
    await this.employeeVendorRepository.update(
      { id: updateEmployeeVendorInput.id },
      updateEmployeeVendorInput,
    );
    return this.findOne({ id: updateEmployeeVendorInput.id });
  }

  public remove(id: string) {
    this.employeeVendorRepository.delete(id);
  }
}
