import { Field, ObjectType } from '@nestjs/graphql';
import { Payment } from '../entities/payment.entity';

@ObjectType()
export class CreatePaymentResponse {
  @Field(() => Payment, { nullable: true })
  payment?: Payment;

  @Field(() => [Payment], { nullable: true })
  payments?: Payment[];
}
