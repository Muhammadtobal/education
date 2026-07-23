import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateAnswerInput } from './dto/create-answer.input';
import { UpdateAnswerInput } from './dto/update-answer.input';
import { Answer } from './entities/answer.entity';
import { FindAllAnswerInput } from './dto/find-all-answer.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}
  public create(createAnswerInput: CreateAnswerInput) {
    const answer = this.answerRepository.create(createAnswerInput);
    return this.answerRepository.save(answer);
  }

  public findAll(filter: FindAllAnswerInput) {
    const query = this.answerRepository
      .createQueryBuilder('answer')
      .where('true');
    generateQuerySorts<Answer>(query, filter, Answer, 'answer');
    generateQueryConditions<Answer>(query, filter, 'answer');

    return customPaginate<Answer, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    answerOptions: FindOptionsWhere<Answer>,
    options?: {
      selected?: FindOptionsSelect<Answer>;
      relations?: FindOptionsRelations<Answer>;
    },
  ) {
    return this.answerRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: answerOptions,
    });
  }

  public async update(updateAnswerInput: UpdateAnswerInput) {
    await this.answerRepository.update(
      { id: updateAnswerInput.id },
      updateAnswerInput,
    );
    return this.findOne({ id: updateAnswerInput.id });
  }

  public remove(id: string) {
    this.answerRepository.delete(id);
  }
}
