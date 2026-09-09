import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateBannerInput } from './dto/create-banner.input';
import { UpdateBannerInput } from './dto/update-banner.input';
import { Banner } from './entities/banner.entity';
import { FindAllBannerInput } from './dto/find-all-banner.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}
  public create(createBannerInput: CreateBannerInput) {
    const banner = this.bannerRepository.create(createBannerInput);
    return this.bannerRepository.save(banner);
  }

  public findAll(filter: FindAllBannerInput) {
    const query = this.bannerRepository
      .createQueryBuilder('banner')
      .where('true');
    generateQuerySorts<Banner>(query, filter, Banner, 'banner');
    generateQueryConditions<Banner>(query, filter, 'banner');

    return customPaginate<Banner, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    bannerOptions: FindOptionsWhere<Banner>,
    options?: {
      selected?: FindOptionsSelect<Banner>;
      relations?: FindOptionsRelations<Banner>;
    },
  ) {
    return this.bannerRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: bannerOptions,
    });
  }

  public async update(updateBannerInput: UpdateBannerInput) {
    await this.bannerRepository.update(
      { id: updateBannerInput.id },
      updateBannerInput,
    );
    return this.findOne({ id: updateBannerInput.id });
  }

  public remove(id: string) {
    this.bannerRepository.delete(id);
  }
}
