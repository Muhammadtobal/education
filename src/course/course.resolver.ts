import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { CourseService } from "./course.service";
import { Course } from "./entities/course.entity";
import { CreateCourseInput } from "./dto/create-course.input";
import { UpdateCourseInput } from "./dto/update-course.input";
import { CoursePaginationResultOutput } from "./dto/find-all-course.output";
import { FindAllCourseInput } from "./dto/find-all-course.input";
import { DoneResponseOutput } from "src/shared/types/done-output";

@Resolver(() => Course)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Mutation(() => Course)
  public createCourse(
    @Args("createCourseInput") createCourseInput: CreateCourseInput,
  ) {
    return this.courseService.create(createCourseInput);
  }

  @Query(() => CoursePaginationResultOutput, { name: "courses" })
  public findAll(@Args("filter") filter: FindAllCourseInput) {
    return this.courseService.findAll(filter);
  }

  @Query(() => Course, { name: "course" })
  public findOne(@Args("id") id: string) {
    return this.courseService.findOne({ id });
  }

  @Mutation(() => Course)
  public updateCourse(
    @Args("updateCourseInput") updateCourseInput: UpdateCourseInput,
  ) {
    return this.courseService.update(updateCourseInput);
  }

  @Mutation(() => DoneResponseOutput)
  public removeCourse(@Args("id") id: string) {
    this.courseService.remove(id);
    return { done: true };
  }
}