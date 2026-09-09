import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { Course } from './entities/course.entity';
import { FindAllCourseInput } from './dto/find-all-course.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}
  public create(createCourseInput: CreateCourseInput) {
    const course = this.courseRepository.create(createCourseInput);
    return this.courseRepository.save(course);
  }

  public findAll(filter: FindAllCourseInput) {
    const query = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.level', 'level')
      .where('true');
    generateQuerySorts<Course>(query, filter, Course, 'course');
    generateQueryConditions<Course>(query, filter, 'course');

    return customPaginate<Course, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    courseOptions: FindOptionsWhere<Course>,
    options?: {
      selected?: FindOptionsSelect<Course>;
      relations?: FindOptionsRelations<Course>;
    },
  ) {
    return this.courseRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: courseOptions,
    });
  }

  public async update(updateCourseInput: UpdateCourseInput) {
    await this.courseRepository.update(
      { id: updateCourseInput.id },
      updateCourseInput,
    );
    return this.findOne({ id: updateCourseInput.id });
  }

  public remove(id: string) {
    this.courseRepository.delete(id);
  }
}
