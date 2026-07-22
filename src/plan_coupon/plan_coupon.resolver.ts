import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { PlanCouponService } from "./plan_coupon.service";
import { PlanCoupon } from "./entities/plan_coupon.entity";
import { CreatePlanCouponInput } from "./dto/create-plan_coupon.input";
import { UpdatePlanCouponInput } from "./dto/update-plan_coupon.input";
import { PlanCouponPaginationResultOutput } from "./dto/find-all-plan_coupon.output";
import { FindAllPlanCouponInput } from "./dto/find-all-plan_coupon.input";
import { DoneResponseOutput } from "src/shared/types/done-output";

@Resolver(() => PlanCoupon)
export class PlanCouponResolver {
  constructor(private readonly planCouponService: PlanCouponService) {}

  @Mutation(() => PlanCoupon)
  public createPlanCoupon(
    @Args("createPlanCouponInput") createPlanCouponInput: CreatePlanCouponInput,
  ) {
    return this.planCouponService.create(createPlanCouponInput);
  }

  @Query(() => PlanCouponPaginationResultOutput, { name: "planCoupons" })
  public findAll(@Args("filter") filter: FindAllPlanCouponInput) {
    return this.planCouponService.findAll(filter);
  }

  @Query(() => PlanCoupon, { name: "planCoupon" })
  public findOne(@Args("id") id: string) {
    return this.planCouponService.findOne({ id });
  }

  @Mutation(() => PlanCoupon)
  public updatePlanCoupon(
    @Args("updatePlanCouponInput") updatePlanCouponInput: UpdatePlanCouponInput,
  ) {
    return this.planCouponService.update(updatePlanCouponInput);
  }

  @Mutation(() => DoneResponseOutput)
  public removePlanCoupon(@Args("id") id: string) {
    this.planCouponService.remove(id);
    return { done: true };
  }
}