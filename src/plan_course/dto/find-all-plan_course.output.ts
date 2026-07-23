import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { PlanCourse } from '../entities/plan_course.entity';

@ObjectType()
export class PlanCoursePaginationResultOutput {
  @Field(() => [PlanCourse])
  items: PlanCourse[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
