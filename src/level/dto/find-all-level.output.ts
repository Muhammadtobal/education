import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { Level } from '../entities/level.entity';

@ObjectType()
export class LevelPaginationResultOutput {
  @Field(() => [Level])
  items: Level[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
