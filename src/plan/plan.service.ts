import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
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

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}
  public create(createPlanInput: CreatePlanInput) {
    const plan = this.planRepository.create(createPlanInput);
    return this.planRepository.save(plan);
  }

  public findAll(filter: FindAllPlanInput) {
    const query = this.planRepository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.vendor', 'vendor')
      .where('true');
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
