import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from "typeorm";

import { CreateQuestionInput } from "./dto/create-question.input";
import { UpdateQuestionInput } from "./dto/update-question.input";
import { Question } from "./entities/question.entity";
import { FindAllQuestionInput } from "./dto/find-all-question.input";


import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from "src/shared/helpers";
import { PaginationMetadata } from "src/shared/types/pagination-metadata";

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}
  public create(createQuestionInput: CreateQuestionInput) {
    const question = this.questionRepository.create(createQuestionInput);
    return this.questionRepository.save(question);
  }

  public findAll(filter: FindAllQuestionInput) {
    const query = this.questionRepository
      .createQueryBuilder("question")
      .where("true");
    generateQuerySorts<Question>(query, filter, Question, "question");
    generateQueryConditions<Question>(query, filter, "question");

    return customPaginate<Question, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page
      });
  }

  public findOne(
    questionOptions: FindOptionsWhere<Question>,
    options?: {
      selected?: FindOptionsSelect<Question>;
      relations?: FindOptionsRelations<Question>;
    },
  ) {
    return this.questionRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: questionOptions,
    });
  }

  public async update(updateQuestionInput: UpdateQuestionInput) {
    await this.questionRepository.update({ id: updateQuestionInput.id }, updateQuestionInput);
    return this.findOne({ id: updateQuestionInput.id });
  }

  public remove(id: string) {
    this.questionRepository.delete(id);
  }
}