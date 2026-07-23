import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PlanCourseService } from './plan_course.service';
import { PlanCourse } from './entities/plan_course.entity';
import { CreatePlanCourseInput } from './dto/create-plan_course.input';
import { UpdatePlanCourseInput } from './dto/update-plan_course.input';
import { PlanCoursePaginationResultOutput } from './dto/find-all-plan_course.output';
import { FindAllPlanCourseInput } from './dto/find-all-plan_course.input';
import { DoneResponseOutput } from 'src/shared/types/done-output';

@Resolver(() => PlanCourse)
export class PlanCourseResolver {
  constructor(private readonly planCourseService: PlanCourseService) {}

  @Mutation(() => PlanCourse)
  public createPlanCourse(
    @Args('createPlanCourseInput') createPlanCourseInput: CreatePlanCourseInput,
  ) {
    return this.planCourseService.create(createPlanCourseInput);
  }

  @Query(() => PlanCoursePaginationResultOutput, { name: 'planCourses' })
  public findAll(@Args('filter') filter: FindAllPlanCourseInput) {
    return this.planCourseService.findAll(filter);
  }

  @Query(() => PlanCourse, { name: 'planCourse' })
  public findOne(@Args('id') id: string) {
    return this.planCourseService.findOne({ id });
  }

  @Mutation(() => PlanCourse)
  public updatePlanCourse(
    @Args('updatePlanCourseInput') updatePlanCourseInput: UpdatePlanCourseInput,
  ) {
    return this.planCourseService.update(updatePlanCourseInput);
  }

  @Mutation(() => DoneResponseOutput)
  public removePlanCourse(@Args('id') id: string) {
    this.planCourseService.remove(id);
    return { done: true };
  }
}
