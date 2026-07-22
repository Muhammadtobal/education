import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { Review } from './entities/review.entity';
import { FindAllReviewInput } from './dto/find-all-review.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}
  public create(createReviewInput: CreateReviewInput) {
    const review = this.reviewRepository.create(createReviewInput);
    return this.reviewRepository.save(review);
  }

  public findAll(filter: FindAllReviewInput) {
    const query = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.video', 'video')
      .where('true');
    generateQuerySorts<Review>(query, filter, Review, 'review');
    generateQueryConditions<Review>(query, filter, 'review');

    return customPaginate<Review, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    reviewOptions: FindOptionsWhere<Review>,
    options?: {
      selected?: FindOptionsSelect<Review>;
      relations?: FindOptionsRelations<Review>;
    },
  ) {
    return this.reviewRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: reviewOptions,
    });
  }

  public async update(updateReviewInput: UpdateReviewInput) {
    await this.reviewRepository.update(
      { id: updateReviewInput.id },
      updateReviewInput,
    );
    return this.findOne({ id: updateReviewInput.id });
  }

  public remove(id: string) {
    this.reviewRepository.delete(id);
  }
}
