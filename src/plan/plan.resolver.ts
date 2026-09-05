import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';

import { PlanService } from './plan.service';
import { Plan } from './entities/plan.entity';

import { CreatePlanInput } from './dto/create-plan.input';
import { UpdatePlanInput } from './dto/update-plan.input';
import { PlanPaginationResultOutput } from './dto/find-all-plan.output';
import { FindAllPlanInput } from './dto/find-all-plan.input';

import { DoneResponseOutput } from 'src/shared/types/done-output';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';
import { GqlContext } from 'src/shared/types/context';
import { getEmpId, getEmpVendors } from 'src/shared/helpers';

@Resolver(() => Plan)
export class PlanResolver {
  constructor(private readonly planService: PlanService) {}

  @Mutation(() => Plan)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Plan.name)
  public async createPlan(
    @Args('createPlanInput') createPlanInput: CreatePlanInput,
    @Context() context: GqlContext,
  ) {
    const empId = getEmpId(context.req.user);
    const vendors = getEmpVendors(context.req.user);

    return this.planService.create(createPlanInput);
  }

  @Query(() => PlanPaginationResultOutput, { name: 'plans' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Plan.name)
  public findAll(
    @Args('filter') filter: FindAllPlanInput,
    @Context() context: GqlContext,
  ) {
    return this.planService.findAll(filter);
  }

  @Query(() => Plan, { name: 'plan' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Plan.name)
  public async findOne(@Args('id') id: string, @Context() context: GqlContext) {
    const empId = getEmpId(context.req.user);
    const vendors = getEmpVendors(context.req.user);

    const plan = await this.planService.findOne({ id });

    return plan;
  }

  @Mutation(() => Plan)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Plan.name)
  public updatePlan(@Args('updatePlanInput') updatePlanInput: UpdatePlanInput) {
    return this.planService.update(updatePlanInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Plan.name)
  public removePlan(@Args('id') id: string) {
    this.planService.remove(id);

    return {
      done: true,
    };
  }
}
