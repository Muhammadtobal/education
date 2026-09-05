import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateTeacherInput } from './dto/create-teacher.input';
import { UpdateTeacherInput } from './dto/update-teacher.input';
import { Teacher } from './entities/teacher.entity';
import { FindAllTeacherInput } from './dto/find-all-teacher.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { CourseService } from 'src/course/course.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,

    private readonly courseService: CourseService,
    private readonly subscriptionService: SubscriptionService,
  ) {}
  public create(createTeacherInput: CreateTeacherInput) {
    const teacher = this.teacherRepository.create(createTeacherInput);
    return this.teacherRepository.save(teacher);
  }

  public findAll(filter: FindAllTeacherInput) {
    const query = this.teacherRepository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.city', 'city')

      .where('true');
    generateQuerySorts<Teacher>(query, filter, Teacher, 'teacher');
    generateQueryConditions<Teacher>(query, filter, 'teacher');

    return customPaginate<Teacher, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    teacherOptions: FindOptionsWhere<Teacher>,
    options?: {
      selected?: FindOptionsSelect<Teacher>;
      relations?: FindOptionsRelations<Teacher>;
    },
  ) {
    return this.teacherRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: teacherOptions,
    });
  }

  public async update(updateTeacherInput: UpdateTeacherInput) {
    await this.teacherRepository.update(
      { id: updateTeacherInput.id },
      updateTeacherInput,
    );
    return this.findOne({ id: updateTeacherInput.id });
  }

  public remove(id: string) {
    this.teacherRepository.delete(id);
  }

  public async teacherStatics(teacherId: string) {
    let totalCourses = 0;
    let totalSubscriptions = 0;

    const students = new Set<string>();

    const courseLimit = 200;
    let coursePage = 1;
    let courseLastPage = false;

    while (!courseLastPage) {
      const coursesResult = await this.courseService.findAllCourseTeacher({
        teacher_id: { value: teacherId },
        pagination: {
          page: coursePage,
          limit: courseLimit,
        },
      });

      if (!coursesResult.items.length) break;

      totalCourses += coursesResult.items.length;

      for (const courseTeacher of coursesResult.items) {
        const courseId = courseTeacher.course_id;

        const subscriptionLimit = 200;
        let subscriptionPage = 1;
        let subscriptionLastPage = false;

        while (!subscriptionLastPage) {
          const subscriptionsResult = await this.subscriptionService.findAll({
            course_id: {
              value: courseId,
            },
            pagination: {
              page: subscriptionPage,
              limit: subscriptionLimit,
            },
          });

          if (!subscriptionsResult.items.length) break;

          totalSubscriptions += subscriptionsResult.items.length;

          for (const subscription of subscriptionsResult.items) {
            students.add(subscription.user_id);
          }

          if (subscriptionsResult.items.length < subscriptionLimit) {
            subscriptionLastPage = true;
          } else {
            subscriptionPage++;
          }
        }
      }

      if (coursesResult.items.length < courseLimit) {
        courseLastPage = true;
      } else {
        coursePage++;
      }
    }

    return {
      totalCourses,
      totalSubscriptions,
      totalStudents: students.size,
    };
  }
}
