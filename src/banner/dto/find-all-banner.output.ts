import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import {Banner} from "../entities/banner.entity";

@ObjectType()
export class BannerPaginationResultOutput {
  @Field(() => [Banner])
  items: Banner[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}