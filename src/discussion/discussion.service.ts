import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from "typeorm";

import { CreateDiscussionInput } from "./dto/create-discussion.input";
import { UpdateDiscussionInput } from "./dto/update-discussion.input";
import { Discussion } from "./entities/discussion.entity";
import { FindAllDiscussionInput } from "./dto/find-all-discussion.input";


import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from "src/shared/helpers";
import { PaginationMetadata } from "src/shared/types/pagination-metadata";

@Injectable()
export class DiscussionService {
  constructor(
    @InjectRepository(Discussion)
    private readonly discussionRepository: Repository<Discussion>,
  ) {}
  public create(createDiscussionInput: CreateDiscussionInput) {
    const discussion = this.discussionRepository.create(createDiscussionInput);
    return this.discussionRepository.save(discussion);
  }

  public findAll(filter: FindAllDiscussionInput) {
    const query = this.discussionRepository
      .createQueryBuilder("discussion")
      .where("true");
    generateQuerySorts<Discussion>(query, filter, Discussion, "discussion");
    generateQueryConditions<Discussion>(query, filter, "discussion");

    return customPaginate<Discussion, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page
      });
  }

  public findOne(
    discussionOptions: FindOptionsWhere<Discussion>,
    options?: {
      selected?: FindOptionsSelect<Discussion>;
      relations?: FindOptionsRelations<Discussion>;
    },
  ) {
    return this.discussionRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: discussionOptions,
    });
  }

  public async update(updateDiscussionInput: UpdateDiscussionInput) {
    await this.discussionRepository.update({ id: updateDiscussionInput.id }, updateDiscussionInput);
    return this.findOne({ id: updateDiscussionInput.id });
  }

  public remove(id: string) {
    this.discussionRepository.delete(id);
  }
}