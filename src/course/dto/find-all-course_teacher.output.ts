import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { Course } from '../entities/course.entity';
import { CourseTeacher } from '../entities/course_teacher.entity';

@ObjectType()
export class CourseTeacherPaginationResultOutput {
  @Field(() => [Course])
  items: CourseTeacher[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
