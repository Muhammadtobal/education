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
import { AnswerUser } from './entities/answer-user.entity';
import { CreateAnswerUserInput } from './dto/create-answer-user.input';
import { FindAllAnswerUserInput } from './dto/find-all-answer-user.input';
import { UpdateAnswerUserInput } from './dto/update-answer-user.input';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(AnswerUser)
    private readonly answerUserRepository: Repository<AnswerUser>,
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

  public createAnswerUser(createAnswerUserInput: CreateAnswerUserInput) {
    const answerUser = this.answerUserRepository.create(createAnswerUserInput);

    return this.answerUserRepository.save(answerUser);
  }

  public findAllAnswerUser(filter: FindAllAnswerUserInput) {
    const query = this.answerUserRepository
      .createQueryBuilder('answer_user')
      .where('true');

    generateQuerySorts<AnswerUser>(query, filter, AnswerUser, 'answer_user');

    generateQueryConditions<AnswerUser>(query, filter, 'answer_user');

    return customPaginate<AnswerUser, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOneAnswerUser(
    answerUserOptions: FindOptionsWhere<AnswerUser>,
    options?: {
      selected?: FindOptionsSelect<AnswerUser>;
      relations?: FindOptionsRelations<AnswerUser>;
    },
  ) {
    return this.answerUserRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: answerUserOptions,
    });
  }

  public async updateAnswerUser(updateAnswerUserInput: UpdateAnswerUserInput) {
    await this.answerUserRepository.update(
      { id: updateAnswerUserInput.id },
      updateAnswerUserInput,
    );

    return this.findOneAnswerUser({
      id: updateAnswerUserInput.id,
    });
  }

  public removeAnswerUser(id: string) {
    this.answerUserRepository.delete(id);
  }
}
