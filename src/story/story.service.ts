import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from "typeorm";

import { CreateStoryInput } from "./dto/create-story.input";
import { UpdateStoryInput } from "./dto/update-story.input";
import { Story } from "./entities/story.entity";
import { FindAllStoryInput } from "./dto/find-all-story.input";


import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from "src/shared/helpers";
import { PaginationMetadata } from "src/shared/types/pagination-metadata";

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
  ) {}
  public create(createStoryInput: CreateStoryInput) {
    const story = this.storyRepository.create(createStoryInput);
    return this.storyRepository.save(story);
  }

  public findAll(filter: FindAllStoryInput) {
    const query = this.storyRepository
      .createQueryBuilder("story")
      .where("true");
    generateQuerySorts<Story>(query, filter, Story, "story");
    generateQueryConditions<Story>(query, filter, "story");

    return customPaginate<Story, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page
      });
  }

  public findOne(
    storyOptions: FindOptionsWhere<Story>,
    options?: {
      selected?: FindOptionsSelect<Story>;
      relations?: FindOptionsRelations<Story>;
    },
  ) {
    return this.storyRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: storyOptions,
    });
  }

  public async update(updateStoryInput: UpdateStoryInput) {
    await this.storyRepository.update({ id: updateStoryInput.id }, updateStoryInput);
    return this.findOne({ id: updateStoryInput.id });
  }

  public remove(id: string) {
    this.storyRepository.delete(id);
  }
}