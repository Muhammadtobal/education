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
import { TeacherService } from 'src/teacher/teacher.service';
import { CourseService } from 'src/course/course.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly teacherService: TeacherService,
    private readonly courseService: CourseService,
  ) {}
  public async create(createReviewInput: CreateReviewInput) {
    const review = await this.reviewRepository.save(
      this.reviewRepository.create(createReviewInput),
    );

    if (createReviewInput.teacher_id) {
      await this.updateTeacherRating(createReviewInput.teacher_id);
    }

    if (createReviewInput.course_id) {
      await this.updateCourseRating(createReviewInput.course_id);
    }

    return review;
  }

  public findAll(filter: FindAllReviewInput) {
    const query = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.teacher', 'teacher')
      .leftJoinAndSelect('review.course', 'course')
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

  private async updateTeacherRating(teacherId: string) {
    const limit = 100;

    let page = 1;
    let lastPage = false;

    let totalRating = 0;
    let totalReviews = 0;

    while (!lastPage) {
      const reviews = await this.findAll({
        teacher_id: { value: teacherId },
        pagination: {
          page,
          limit,
        },
      });

      for (const review of reviews.items) {
        totalRating += review.value;
        totalReviews++;
      }

      if (reviews.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    await this.teacherService.update({
      id: teacherId,
      rating: totalReviews ? totalRating / totalReviews : 0,
    });
  }

  private async updateCourseRating(courseId: string) {
    const limit = 100;

    let page = 1;
    let lastPage = false;

    let totalRating = 0;
    let totalReviews = 0;

    while (!lastPage) {
      const reviews = await this.findAll({
        course_id: { value: courseId },
        pagination: {
          page,
          limit,
        },
      });

      for (const review of reviews.items) {
        totalRating += review.value;
        totalReviews++;
      }

      if (reviews.items.length < limit) {
        lastPage = true;
      } else {
        page++;
      }
    }

    await this.courseService.update({
      id: courseId,
      rating: totalReviews ? totalRating / totalReviews : 0,
    });
  }
}
