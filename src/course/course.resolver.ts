import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { CourseService } from './course.service';
import { Course } from './entities/course.entity';

import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { FindAllCourseInput } from './dto/find-all-course.input';
import { CoursePaginationResultOutput } from './dto/find-all-course.output';

import { DoneResponseOutput } from 'src/shared/types/done-output';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';

import { GqlContext } from 'src/shared/types/context';
import { getEmpId, getEmpVendors } from 'src/shared/helpers';

@Resolver(() => Course)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Mutation(() => Course)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Course.name)
  public async createCourse(
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
    @Context() context: GqlContext,
  ) {
    return this.courseService.create(createCourseInput);
  }

  @Query(() => CoursePaginationResultOutput, { name: 'courses' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Course.name)
  public findAll(
    @Args('filter') filter: FindAllCourseInput,
    @Context() context: GqlContext,
  ) {
    return this.courseService.findAll(filter);
  }

  @Query(() => Course, { name: 'course' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Course.name)
  public async findOne(@Args('id') id: string, @Context() context: GqlContext) {
    const empId = getEmpId(context.req.user);
    const vendors = getEmpVendors(context.req.user);

    const course = await this.courseService.findOne({ id });

    return course;
  }

  @Mutation(() => Course)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + Course.name)
  public updateCourse(
    @Args('updateCourseInput') updateCourseInput: UpdateCourseInput,
  ) {
    return this.courseService.update(updateCourseInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + Course.name)
  public removeCourse(@Args('id') id: string) {
    this.courseService.remove(id);

    return {
      done: true,
    };
  }
}
