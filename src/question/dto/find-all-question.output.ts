import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { Question } from '../entities/question.entity';

@ObjectType()
export class QuestionPaginationResultOutput {
  @Field(() => [Question])
  items: Question[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
