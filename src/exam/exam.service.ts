import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateExamInput } from './dto/create-exam.input';
import { UpdateExamInput } from './dto/update-exam.input';
import { Exam } from './entities/exam.entity';
import { FindAllExamInput } from './dto/find-all-exam.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { ExamUser } from './entities/exam-user.entity';
import { CreateExamUserInput } from './dto/create-exam_user.input';
import { FindAllExamUserInput } from './dto/find-all-exam_user.input';
import { UpdateExamUserInput } from './dto/update-exam_user.input';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,

    @InjectRepository(ExamUser)
    private readonly examUserRepository: Repository<ExamUser>,
  ) {}
  public create(createExamInput: CreateExamInput) {
    const exam = this.examRepository.create(createExamInput);
    return this.examRepository.save(exam);
  }

  public findAll(filter: FindAllExamInput) {
    const query = this.examRepository
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.course', 'course')
      .where('true');
    generateQuerySorts<Exam>(query, filter, Exam, 'exam');
    generateQueryConditions<Exam>(query, filter, 'exam');

    return customPaginate<Exam, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    examOptions: FindOptionsWhere<Exam>,
    options?: {
      selected?: FindOptionsSelect<Exam>;
      relations?: FindOptionsRelations<Exam>;
    },
  ) {
    return this.examRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: examOptions,
    });
  }

  public async update(updateExamInput: UpdateExamInput) {
    await this.examRepository.update(
      { id: updateExamInput.id },
      updateExamInput,
    );
    return this.findOne({ id: updateExamInput.id });
  }

  public remove(id: string) {
    this.examRepository.delete(id);
  }

  public createExamUser(createExamUserInput: CreateExamUserInput) {
    const examUser = this.examUserRepository.create(createExamUserInput);

    return this.examUserRepository.save(examUser);
  }

  public findAllExamUser(filter: FindAllExamUserInput) {
    const query = this.examUserRepository
      .createQueryBuilder('exam_user')
      .leftJoinAndSelect('exam_user.exam', 'exam')
      .leftJoinAndSelect('exam_user.user', 'user')

      .where('true');

    generateQuerySorts<ExamUser>(query, filter, ExamUser, 'exam_user');

    generateQueryConditions<ExamUser>(query, filter, 'exam_user');

    return customPaginate<ExamUser, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOneExamUser(
    examUserOptions: FindOptionsWhere<ExamUser>,
    options?: {
      selected?: FindOptionsSelect<ExamUser>;
      relations?: FindOptionsRelations<ExamUser>;
    },
  ) {
    return this.examUserRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: examUserOptions,
    });
  }

  public async updateExamUser(updateExamUserInput: UpdateExamUserInput) {
    await this.examUserRepository.update(
      { id: updateExamUserInput.id },
      updateExamUserInput,
    );

    return this.findOneExamUser({
      id: updateExamUserInput.id,
    });
  }

  public removeExamUser(id: string) {
    this.examUserRepository.delete(id);
  }
}
