import { Injectable } from '@nestjs/common';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';

import { Permission } from './entities/permission.entity';

import { FindAllPermissionInput } from './dto/find-all-permission.input';
import {
  customPaginate,
  generateQueryConditions,
  generateQuerySorts,
  metaTransformer,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  public create(createPermissionInput: CreatePermissionInput) {
    const permission = this.permissionRepository.create(createPermissionInput);
    return this.permissionRepository.save(permission);
  }

  public findAll(filter: FindAllPermissionInput) {
    const query = this.permissionRepository
      .createQueryBuilder('permission')
      .where('true');

    generateQuerySorts<Permission>(query, filter, Permission, 'permission');

    generateQueryConditions<Permission>(query, filter, 'permission');

    return customPaginate<Permission, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    permissionOptions: FindOptionsWhere<Permission>,
    options?: {
      selected?: FindOptionsSelect<Permission>;
      relations?: FindOptionsRelations<Permission>;
    },
  ) {
    return this.permissionRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: permissionOptions,
    });
  }

  public async update(updatePermissionInput: UpdatePermissionInput) {
    await this.permissionRepository.update(
      { id: updatePermissionInput.id },
      updatePermissionInput,
    );
    return this.findOne({ id: updatePermissionInput.id });
  }

  public remove(id: string) {
    this.permissionRepository.delete({ id });
  }

  // public async syncPermissions() {
  //   const existingPermissions = await this.permissionRepository.find({
  //     select: ['name'],
  //   });

  //   const existingKeys = new Set(existingPermissions.map((perm) => perm.name));

  //   const newPermissions = Object.entries(PermissionsStore)
  //     .filter(([, value]) => !existingKeys.has(value as string))
  //     .map(([, value]) => ({ name: value }));

  //   if (newPermissions.length > 0) {
  //     await this.permissionRepository.insert(newPermissions as Permission[]);
  //     console.log(`Added ${newPermissions.length} new permissions.`);
  //   } else console.log('All permissions are already synced.');
  // }
}
