import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import {Content} from "../entities/content.entity";

@ObjectType()
export class ContentPaginationResultOutput {
  @Field(() => [Content])
  items: Content[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}