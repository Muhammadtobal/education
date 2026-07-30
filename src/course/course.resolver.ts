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

import { CourseTeacher } from './entities/course_teacher.entity';
import { CreateCourseTeacherInput } from './dto/create-course_teacher.input';
import { CourseTeacherPaginationResultOutput } from './dto/find-all-course_teacher.output';
import { FindAllCourseTeacherInput } from './dto/find-all-course_teacher.input';
import { UpdateCourseTeacherInput } from './dto/update-course_teacher.input';

import { GqlContext } from 'src/shared/types/context';
import { getEmpId, getEmpVendors } from 'src/shared/helpers';
import { EmployeeVendorService } from 'src/employee_vendor/employee_vendor.service';

@Resolver(() => Course)
export class CourseResolver {
  constructor(
    private readonly courseService: CourseService,
    private readonly employeeVendorService: EmployeeVendorService,
  ) {}

  @Mutation(() => Course)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + Course.name)
  public async createCourse(
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
    @Context() context: GqlContext,
  ) {
    const empId = getEmpId(context.req.user);
    const vendors = getEmpVendors(context.req.user);

    if (vendors.length > 0 && empId) {
      await this.employeeVendorService.validateEmployeeVendor(
        empId,
        createCourseInput.vendor_id,
      );
    }

    return this.courseService.create(createCourseInput);
  }

  @Query(() => CoursePaginationResultOutput, { name: 'courses' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Course.name)
  public findAll(
    @Args('filter') filter: FindAllCourseInput,
    @Context() context: GqlContext,
  ) {
    const empId = getEmpId(context.req.user);
    const vendors = getEmpVendors(context.req.user);

    if (vendors.length > 0 && empId) {
      return this.courseService.findAll({
        ...filter,
        vendor_id: {
          ids: vendors.map((vendor) => vendor.vendor_id),
        },
      });
    }

    return this.courseService.findAll(filter);
  }

  @Query(() => Course, { name: 'course' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Course.name)
  public async findOne(@Args('id') id: string, @Context() context: GqlContext) {
    const empId = getEmpId(context.req.user);
    const vendors = getEmpVendors(context.req.user);

    const course = await this.courseService.findOne({ id });

    if (vendors.length > 0 && empId && course) {
      await this.employeeVendorService.validateEmployeeVendor(
        empId,
        course.vendor_id,
      );
    }

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

  @Mutation(() => CourseTeacher)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.CREATE + CourseTeacher.name)
  createCourseTeacher(
    @Args('createCourseTeacherInput')
    createCourseTeacherInput: CreateCourseTeacherInput,
  ) {
    return this.courseService.createCourseTeacher(createCourseTeacherInput);
  }

  @Query(() => CourseTeacherPaginationResultOutput, {
    name: 'course_teachers',
  })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + CourseTeacher.name)
  findAllCourseTeacher(
    @Args('filter')
    filter: FindAllCourseTeacherInput,
  ) {
    return this.courseService.findAllCourseTeacher(filter);
  }

  @Query(() => CourseTeacher, { name: 'course_teacher' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + CourseTeacher.name)
  findOneCourseTeacher(@Args('id') id: string) {
    return this.courseService.findOne({ id });
  }

  @Mutation(() => CourseTeacher)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.UPDATE + CourseTeacher.name)
  updateCourseTeacher(
    @Args('updateCourseTeacherInput')
    updateCourseTeacherInput: UpdateCourseTeacherInput,
  ) {
    return this.courseService.updateCourseTeacher(updateCourseTeacherInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.DELETE + CourseTeacher.name)
  removeCourseTeacher(@Args('id') id: string) {
    this.courseService.removeCourseTeacher(id);

    return {
      done: true,
    };
  }
}
