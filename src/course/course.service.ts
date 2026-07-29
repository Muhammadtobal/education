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
import { CourseTeacher } from './entities/course_teacher.entity';
import { CreateCourseTeacherInput } from './dto/create-course_teacher.input';
import { FindAllCourseTeacherInput } from './dto/find-all-course_teacher.input';
import { UpdateCourseTeacherInput } from './dto/update-course_teacher.input';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(CourseTeacher)
    private readonly courseTeacherRepository: Repository<CourseTeacher>,
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

  public createCourseTeacher(
    createCourseTeacherInput: CreateCourseTeacherInput,
  ) {
    const courseTeacher = this.courseTeacherRepository.create(
      createCourseTeacherInput,
    );

    return this.courseTeacherRepository.save(courseTeacher);
  }

  public findAllCourseTeacher(filter: FindAllCourseTeacherInput) {
    const query = this.courseTeacherRepository
      .createQueryBuilder('course_teacher')
      .leftJoinAndSelect('course_teacher.course', 'course')
      .leftJoinAndSelect('course_teacher.teacher', 'teacher')

      .where('true');

    generateQuerySorts<CourseTeacher>(
      query,
      filter,
      CourseTeacher,
      'course_teacher',
    );

    generateQueryConditions<CourseTeacher>(query, filter, 'course_teacher');

    return customPaginate<CourseTeacher, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOneCourseTeacher(
    courseTeacherOptions: FindOptionsWhere<CourseTeacher>,
    options?: {
      selected?: FindOptionsSelect<CourseTeacher>;
      relations?: FindOptionsRelations<CourseTeacher>;
    },
  ) {
    return this.courseTeacherRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: courseTeacherOptions,
    });
  }

  public async updateCourseTeacher(
    updateCourseTeacherInput: UpdateCourseTeacherInput,
  ) {
    await this.courseTeacherRepository.update(
      { id: updateCourseTeacherInput.id },
      updateCourseTeacherInput,
    );

    return this.findOneCourseTeacher({
      id: updateCourseTeacherInput.id,
    });
  }

  public removeCourseTeacher(id: string) {
    return this.courseTeacherRepository.delete(id);
  }
}
