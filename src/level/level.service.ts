import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateLevelInput } from './dto/create-level.input';
import { UpdateLevelInput } from './dto/update-level.input';
import { Level } from './entities/level.entity';
import { FindAllLevelInput } from './dto/find-all-level.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
  ) {}
  public create(createLevelInput: CreateLevelInput) {
    const level = this.levelRepository.create(createLevelInput);
    return this.levelRepository.save(level);
  }

  public findAll(filter: FindAllLevelInput) {
    const query = this.levelRepository
      .createQueryBuilder('level')
      .where('true');
    generateQuerySorts<Level>(query, filter, Level, 'level');
    generateQueryConditions<Level>(query, filter, 'level');

    return customPaginate<Level, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    levelOptions: FindOptionsWhere<Level>,
    options?: {
      selected?: FindOptionsSelect<Level>;
      relations?: FindOptionsRelations<Level>;
    },
  ) {
    return this.levelRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: levelOptions,
    });
  }

  public async update(updateLevelInput: UpdateLevelInput) {
    await this.levelRepository.update(
      { id: updateLevelInput.id },
      updateLevelInput,
    );
    return this.findOne({ id: updateLevelInput.id });
  }

  public remove(id: string) {
    this.levelRepository.delete(id);
  }
}
