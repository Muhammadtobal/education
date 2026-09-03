import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateVendorInput } from './dto/create-vendor.input';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { Vendor } from './entities/vendor.entity';
import { FindAllVendorInput } from './dto/find-all-vendor.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}
  public create(createVendorInput: CreateVendorInput) {
    const vendor = this.vendorRepository.create(createVendorInput);
    console.log('Das');
    return this.vendorRepository.save(vendor);
  }

  public findAll(filter: FindAllVendorInput) {
    const query = this.vendorRepository
      .createQueryBuilder('vendor')
      .where('true');
    generateQuerySorts<Vendor>(query, filter, Vendor, 'vendor');
    generateQueryConditions<Vendor>(query, filter, 'vendor');

    return customPaginate<Vendor, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    vendorOptions: FindOptionsWhere<Vendor>,
    options?: {
      selected?: FindOptionsSelect<Vendor>;
      relations?: FindOptionsRelations<Vendor>;
    },
  ) {
    return this.vendorRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: vendorOptions,
    });
  }

  public async update(updateVendorInput: UpdateVendorInput) {
    await this.vendorRepository.update(
      { id: updateVendorInput.id },
      updateVendorInput,
    );
    return this.findOne({ id: updateVendorInput.id });
  }

  public remove(id: string) {
    this.vendorRepository.delete(id);
  }
}
