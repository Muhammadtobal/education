import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { Answer } from '../entities/answer.entity';

@ObjectType()
export class AnswerPaginationResultOutput {
  @Field(() => [Answer])
  items: Answer[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
