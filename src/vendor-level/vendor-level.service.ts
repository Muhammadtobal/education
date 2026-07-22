import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from "typeorm";

import { CreateVendorLevelInput } from "./dto/create-vendor-level.input";
import { UpdateVendorLevelInput } from "./dto/update-vendor-level.input";
import { VendorLevel } from "./entities/vendor-level.entity";
import { FindAllVendorLevelInput } from "./dto/find-all-vendor-level.input";


import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from "src/shared/helpers";
import { PaginationMetadata } from "src/shared/types/pagination-metadata";

@Injectable()
export class VendorLevelService {
  constructor(
    @InjectRepository(VendorLevel)
    private readonly vendorLevelRepository: Repository<VendorLevel>,
  ) {}
  public create(createVendorLevelInput: CreateVendorLevelInput) {
    const vendorLevel = this.vendorLevelRepository.create(createVendorLevelInput);
    return this.vendorLevelRepository.save(vendorLevel);
  }

  public findAll(filter: FindAllVendorLevelInput) {
    const query = this.vendorLevelRepository
      .createQueryBuilder("vendorLevel")
      .where("true");
    generateQuerySorts<VendorLevel>(query, filter, VendorLevel, "vendorLevel");
    generateQueryConditions<VendorLevel>(query, filter, "vendorLevel");

    return customPaginate<VendorLevel, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page
      });
  }

  public findOne(
    vendorLevelOptions: FindOptionsWhere<VendorLevel>,
    options?: {
      selected?: FindOptionsSelect<VendorLevel>;
      relations?: FindOptionsRelations<VendorLevel>;
    },
  ) {
    return this.vendorLevelRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: vendorLevelOptions,
    });
  }

  public async update(updateVendorLevelInput: UpdateVendorLevelInput) {
    await this.vendorLevelRepository.update({ id: updateVendorLevelInput.id }, updateVendorLevelInput);
    return this.findOne({ id: updateVendorLevelInput.id });
  }

  public remove(id: string) {
    this.vendorLevelRepository.delete(id);
  }
}