import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreatePlanCourseInput } from './dto/create-plan_course.input';
import { UpdatePlanCourseInput } from './dto/update-plan_course.input';
import { PlanCourse } from './entities/plan_course.entity';
import { FindAllPlanCourseInput } from './dto/find-all-plan_course.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';

@Injectable()
export class PlanCourseService {
  constructor(
    @InjectRepository(PlanCourse)
    private readonly planCourseRepository: Repository<PlanCourse>,
  ) {}
  public create(createPlanCourseInput: CreatePlanCourseInput) {
    const planCourse = this.planCourseRepository.create(createPlanCourseInput);
    return this.planCourseRepository.save(planCourse);
  }

  public findAll(filter: FindAllPlanCourseInput) {
    const query = this.planCourseRepository
      .createQueryBuilder('plan_course')
      .where('true');
    generateQuerySorts<PlanCourse>(query, filter, PlanCourse, 'plan_course');
    generateQueryConditions<PlanCourse>(query, filter, 'plan_course');

    return customPaginate<PlanCourse, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    planCourseOptions: FindOptionsWhere<PlanCourse>,
    options?: {
      selected?: FindOptionsSelect<PlanCourse>;
      relations?: FindOptionsRelations<PlanCourse>;
    },
  ) {
    return this.planCourseRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: planCourseOptions,
    });
  }

  public async update(updatePlanCourseInput: UpdatePlanCourseInput) {
    await this.planCourseRepository.update(
      { id: updatePlanCourseInput.id },
      updatePlanCourseInput,
    );
    return this.findOne({ id: updatePlanCourseInput.id });
  }

  public remove(id: string) {
    this.planCourseRepository.delete(id);
  }
}
