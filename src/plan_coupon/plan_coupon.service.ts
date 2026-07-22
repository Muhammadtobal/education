import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { paginate } from "nestjs-typeorm-paginate";
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from "typeorm";

import { CreatePlanCouponInput } from "./dto/create-plan_coupon.input";
import { UpdatePlanCouponInput } from "./dto/update-plan_coupon.input";
import { PlanCoupon } from "./entities/plan_coupon.entity";
import { FindAllPlanCouponInput } from "./dto/find-all-plan_coupon.input";


import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from "src/shared/helpers";
import { PaginationMetadata } from "src/shared/types/pagination-metadata";

@Injectable()
export class PlanCouponService {
  constructor(
    @InjectRepository(PlanCoupon)
    private readonly planCouponRepository: Repository<PlanCoupon>,
  ) {}
  public create(createPlanCouponInput: CreatePlanCouponInput) {
    const planCoupon = this.planCouponRepository.create(createPlanCouponInput);
    return this.planCouponRepository.save(planCoupon);
  }

  public findAll(filter: FindAllPlanCouponInput) {
    const query = this.planCouponRepository
      .createQueryBuilder("planCoupon")
      .where("true");
    generateQuerySorts<PlanCoupon>(query, filter, PlanCoupon, "planCoupon");
    generateQueryConditions<PlanCoupon>(query, filter, "planCoupon");

    return customPaginate<PlanCoupon, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page
      });
  }

  public findOne(
    planCouponOptions: FindOptionsWhere<PlanCoupon>,
    options?: {
      selected?: FindOptionsSelect<PlanCoupon>;
      relations?: FindOptionsRelations<PlanCoupon>;
    },
  ) {
    return this.planCouponRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: planCouponOptions,
    });
  }

  public async update(updatePlanCouponInput: UpdatePlanCouponInput) {
    await this.planCouponRepository.update({ id: updatePlanCouponInput.id }, updatePlanCouponInput);
    return this.findOne({ id: updatePlanCouponInput.id });
  }

  public remove(id: string) {
    this.planCouponRepository.delete(id);
  }
}