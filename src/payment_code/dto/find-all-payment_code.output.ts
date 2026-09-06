import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { PaymentCode } from '../entities/payment_code.entity';

@ObjectType()
export class PaymentCodePaginationResultOutput {
  @Field(() => [PaymentCode])
  items: PaymentCode[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
