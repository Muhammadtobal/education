import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  DataSource,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreatePlanInput } from './dto/create-plan.input';
import { UpdatePlanInput } from './dto/update-plan.input';
import { Plan } from './entities/plan.entity';
import { FindAllPlanInput } from './dto/find-all-plan.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { Course } from 'src/course/entities/course.entity';
import { Content } from 'src/content/entities/content.entity';
import { PlanCourse } from 'src/plan_course/entities/plan_course.entity';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  public async create(createPlanInput: CreatePlanInput) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ==========================================
      // 1. CREATE PLAN
      // ==========================================

      const plan = queryRunner.manager.create(Plan, {
        name: createPlanInput.name,
        count_days: createPlanInput.count_days ?? 0,
        active: createPlanInput.active ?? true,
        price: 0,
      });

      const savedPlan = await queryRunner.manager.save(Plan, plan);

      // ==========================================
      // 2. CREATE PLAN COURSES / CONTENTS
      // ==========================================

      const planCourses: PlanCourse[] = [];

      let totalPrice = 0;

      for (const item of createPlanInput.plan_courses ?? []) {
        // ------------------------------------------
        // Must have course OR content
        // ------------------------------------------

        if (!item.course_id && !item.content_id) {
          throw new Error('Either course_id or content_id is required');
        }

        // ------------------------------------------
        // Cannot have both
        // ------------------------------------------

        if (item.course_id && item.content_id) {
          throw new Error('You cannot set course_id and content_id together');
        }

        // ------------------------------------------
        // Validate rate
        // ------------------------------------------

        if (item.rate < 0 || item.rate > 100) {
          throw new Error('Rate must be between 0 and 100');
        }

        let calculatedPrice = 0;

        // ==========================================
        // COURSE
        // ==========================================

        if (item.course_id) {
          const course = await queryRunner.manager.findOne(Course, {
            where: {
              id: item.course_id,
            },
          });

          if (!course) {
            throw new Error(`Course ${item.course_id} not found`);
          }

          const originalPrice = Number(course.price);

          calculatedPrice = (originalPrice * item.rate) / 100;
        }

        // ==========================================
        // CONTENT
        // ==========================================

        if (item.content_id) {
          const content = await queryRunner.manager.findOne(Content, {
            where: {
              id: item.content_id,
            },
          });

          if (!content) {
            throw new Error(`Content ${item.content_id} not found`);
          }

          const originalPrice = Number(content.price);

          calculatedPrice = (originalPrice * item.rate) / 100;
        }

        // ==========================================
        // CREATE PLAN COURSE
        // ==========================================

        const planCourse = queryRunner.manager.create(PlanCourse, {
          plan_id: savedPlan.id,

          course_id: item.course_id,

          content_id: item.content_id,

          rate: item.rate,

          price_after_discount: calculatedPrice,

          active: item.active ?? true,
        });

        planCourses.push(planCourse);

        // ==========================================
        // ADD TO PLAN TOTAL
        // ==========================================

        totalPrice += calculatedPrice;
      }

      // ==========================================
      // 3. SAVE PLAN COURSES
      // ==========================================

      if (planCourses.length > 0) {
        await queryRunner.manager.save(PlanCourse, planCourses);
      }

      // ==========================================
      // 4. UPDATE PLAN PRICE
      // ==========================================

      savedPlan.price = totalPrice;

      await queryRunner.manager.save(Plan, savedPlan);

      // ==========================================
      // 5. COMMIT
      // ==========================================

      await queryRunner.commitTransaction();

      return savedPlan;
    } catch (error) {
      // ==========================================
      // ROLLBACK
      // ==========================================

      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      // ==========================================
      // RELEASE
      // ==========================================

      await queryRunner.release();
    }
  }
  public findAll(filter: FindAllPlanInput) {
    const query = this.planRepository.createQueryBuilder('plan').where('true');
    generateQuerySorts<Plan>(query, filter, Plan, 'plan');
    generateQueryConditions<Plan>(query, filter, 'plan');

    return customPaginate<Plan, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });
  }

  public findOne(
    planOptions: FindOptionsWhere<Plan>,
    options?: {
      selected?: FindOptionsSelect<Plan>;
      relations?: FindOptionsRelations<Plan>;
    },
  ) {
    return this.planRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: planOptions,
    });
  }

  public async update(updatePlanInput: UpdatePlanInput) {
    await this.planRepository.update(
      { id: updatePlanInput.id },
      updatePlanInput,
    );
    return this.findOne({ id: updatePlanInput.id });
  }

  public remove(id: string) {
    this.planRepository.delete(id);
  }
}
