import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { PlanCourseService } from './plan_course.service';
import { PlanCourse } from './entities/plan_course.entity';

import { CreatePlanCourseInput } from './dto/create-plan_course.input';
import { UpdatePlanCourseInput } from './dto/update-plan_course.input';
import { PlanCoursePaginationResultOutput } from './dto/find-all-plan_course.output';
import { FindAllPlanCourseInput } from './dto/find-all-plan_course.input';

import { DoneResponseOutput } from 'src/shared/types/done-output';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';

@Resolver(() => PlanCourse)
export class PlanCourseResolver {
  constructor(private readonly planCourseService: PlanCourseService) {}

  @Mutation(() => PlanCourse)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + PlanCourse.name)
  public createPlanCourse(
    @Args('createPlanCourseInput')
    createPlanCourseInput: CreatePlanCourseInput,
  ) {
    return this.planCourseService.create(createPlanCourseInput);
  }

  @Query(() => PlanCoursePaginationResultOutput, { name: 'plan_courses' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + PlanCourse.name)
  public findAll(@Args('filter') filter: FindAllPlanCourseInput) {
    return this.planCourseService.findAll(filter);
  }

  @Query(() => PlanCourse, { name: 'plan_course' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + PlanCourse.name)
  public findOne(@Args('id') id: string) {
    return this.planCourseService.findOne({ id });
  }

  @Mutation(() => PlanCourse)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + PlanCourse.name)
  public updatePlanCourse(
    @Args('updatePlanCourseInput')
    updatePlanCourseInput: UpdatePlanCourseInput,
  ) {
    return this.planCourseService.update(updatePlanCourseInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + PlanCourse.name)
  public removePlanCourse(@Args('id') id: string) {
    this.planCourseService.remove(id);

    return {
      done: true,
    };
  }
}
