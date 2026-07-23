import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PlanService } from './plan.service';
import { Plan } from './entities/plan.entity';
import { CreatePlanInput } from './dto/create-plan.input';
import { UpdatePlanInput } from './dto/update-plan.input';
import { PlanPaginationResultOutput } from './dto/find-all-plan.output';
import { FindAllPlanInput } from './dto/find-all-plan.input';
import { DoneResponseOutput } from 'src/shared/types/done-output';

@Resolver(() => Plan)
export class PlanResolver {
  constructor(private readonly planService: PlanService) {}

  @Mutation(() => Plan)
  public createPlan(@Args('createPlanInput') createPlanInput: CreatePlanInput) {
    return this.planService.create(createPlanInput);
  }

  @Query(() => PlanPaginationResultOutput, { name: 'plans' })
  public findAll(@Args('filter') filter: FindAllPlanInput) {
    return this.planService.findAll(filter);
  }

  @Query(() => Plan, { name: 'plan' })
  public findOne(@Args('id') id: string) {
    return this.planService.findOne({ id });
  }

  @Mutation(() => Plan)
  public updatePlan(@Args('updatePlanInput') updatePlanInput: UpdatePlanInput) {
    return this.planService.update(updatePlanInput);
  }

  @Mutation(() => DoneResponseOutput)
  public removePlan(@Args('id') id: string) {
    this.planService.remove(id);
    return { done: true };
  }
}
