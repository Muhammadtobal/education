import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { PlanCouponService } from './plan_coupon.service';
import { PlanCoupon } from './entities/plan_coupon.entity';

import { CreatePlanCouponInput } from './dto/create-plan_coupon.input';
import { UpdatePlanCouponInput } from './dto/update-plan_coupon.input';
import { PlanCouponPaginationResultOutput } from './dto/find-all-plan_coupon.output';
import { FindAllPlanCouponInput } from './dto/find-all-plan_coupon.input';

import { DoneResponseOutput } from 'src/shared/types/done-output';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';

@Resolver(() => PlanCoupon)
export class PlanCouponResolver {
  constructor(private readonly planCouponService: PlanCouponService) {}

  @Mutation(() => PlanCoupon)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + PlanCoupon.name)
  public createPlanCoupon(
    @Args('createPlanCouponInput')
    createPlanCouponInput: CreatePlanCouponInput,
  ) {
    return this.planCouponService.create(createPlanCouponInput);
  }

  @Query(() => PlanCouponPaginationResultOutput, { name: 'plan_coupons' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + PlanCoupon.name)
  public findAll(@Args('filter') filter: FindAllPlanCouponInput) {
    return this.planCouponService.findAll(filter);
  }

  @Query(() => PlanCoupon, { name: 'plan_coupon' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + PlanCoupon.name)
  public findOne(@Args('id') id: string) {
    return this.planCouponService.findOne({ id });
  }

  @Mutation(() => PlanCoupon)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + PlanCoupon.name)
  public updatePlanCoupon(
    @Args('updatePlanCouponInput')
    updatePlanCouponInput: UpdatePlanCouponInput,
  ) {
    return this.planCouponService.update(updatePlanCouponInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + PlanCoupon.name)
  public removePlanCoupon(@Args('id') id: string) {
    this.planCouponService.remove(id);

    return {
      done: true,
    };
  }
}
