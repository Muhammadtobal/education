import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { LoginHistory } from '../entities/login_history.entity';

@ObjectType()
export class LoginHistoryPaginationResultOutput {
  @Field(() => [LoginHistory])
  items: LoginHistory[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
