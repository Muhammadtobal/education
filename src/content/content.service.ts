import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { Content } from './entities/content.entity';
import { FindAllContentInput } from './dto/find-all-content.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}
  public create(createContentInput: CreateContentInput) {
    const content = this.contentRepository.create(createContentInput);
    return this.contentRepository.save(content);
  }

  public findAll(filter: FindAllContentInput) {
    const query = this.contentRepository
      .createQueryBuilder('content')
      .leftJoinAndSelect('content.course', 'course')
      .leftJoinAndSelect('content.exam', 'exam')
      .where('true');

    if (filter.parent_content === true) {
      query.andWhere('content.parent_id IS NULL');
    }

    const { parent_content, ...contentFilter } = filter;
    generateQuerySorts<Content>(query, contentFilter, Content, 'content');
    generateQueryConditions<Content>(query, contentFilter, 'content');

    return customPaginate<Content, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    contentOptions: FindOptionsWhere<Content>,
    options?: {
      selected?: FindOptionsSelect<Content>;
      relations?: FindOptionsRelations<Content>;
    },
  ) {
    return this.contentRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: contentOptions,
    });
  }

  public async update(updateContentInput: UpdateContentInput) {
    await this.contentRepository.update(
      { id: updateContentInput.id },
      updateContentInput,
    );
    return this.findOne({ id: updateContentInput.id });
  }

  public remove(id: string) {
    this.contentRepository.delete(id);
  }
}
