import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { Answer } from '../entities/answer.entity';
import { AnswerUser } from '../entities/answer-user.entity';

@ObjectType()
export class AnswerUserPaginationResultOutput {
  @Field(() => [AnswerUser])
  items: AnswerUser[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
