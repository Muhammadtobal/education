import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { Exam } from '../entities/exam.entity';
import { ExamUser } from '../entities/exam-user.entity';

@ObjectType()
export class ExamUserPaginationResultOutput {
  @Field(() => [ExamUser])
  items: ExamUser[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
