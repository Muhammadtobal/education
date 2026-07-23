import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { ScheduledNotification } from '../entities/scheduled-notification.entity';

@ObjectType()
export class ScheduledNotificationPaginationResultOutput {
  @Field(() => [ScheduledNotification])
  items: ScheduledNotification[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
