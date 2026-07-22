import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from "typeorm";

import { CreateExamInput } from "./dto/create-exam.input";
import { UpdateExamInput } from "./dto/update-exam.input";
import { Exam } from "./entities/exam.entity";
import { FindAllExamInput } from "./dto/find-all-exam.input";


import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from "src/shared/helpers";
import { PaginationMetadata } from "src/shared/types/pagination-metadata";

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
  ) {}
  public create(createExamInput: CreateExamInput) {
    const exam = this.examRepository.create(createExamInput);
    return this.examRepository.save(exam);
  }

  public findAll(filter: FindAllExamInput) {
    const query = this.examRepository
      .createQueryBuilder("exam")
      .where("true");
    generateQuerySorts<Exam>(query, filter, Exam, "exam");
    generateQueryConditions<Exam>(query, filter, "exam");

    return customPaginate<Exam, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page
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
    await this.examRepository.update({ id: updateExamInput.id }, updateExamInput);
    return this.findOne({ id: updateExamInput.id });
  }

  public remove(id: string) {
    this.examRepository.delete(id);
  }
}