import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { Exam } from '../entities/exam.entity';

@ObjectType()
export class ExamPaginationResultOutput {
  @Field(() => [Exam])
  items: Exam[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
