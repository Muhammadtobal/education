import { Field, ObjectType } from "@nestjs/graphql";

import { PaginationMetadata } from "src/shared/types/pagination-metadata";
import {Payment} from "../entities/payment.entity";

@ObjectType()
export class PaymentPaginationResultOutput {
  @Field(() => [Payment])
  items: Payment[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}