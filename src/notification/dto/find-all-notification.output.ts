import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import { Notification } from "../entities/notification.entity";

@ObjectType()
export class NotificationPaginationResultOutput {
  @Field(() => [Notification])
  items: Notification[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
