import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { PaymentPaginationResultOutput } from './dto/find-all-payment.output';
import { FindAllPaymentInput } from './dto/find-all-payment.input';
import { DoneResponseOutput } from 'src/shared/types/done-output';
import { UseGuards } from '@nestjs/common';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => Payment)
  @UseGuards(JwtAuthSharedGuard)
  public createPayment(
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
  ) {
    return this.paymentService.create(createPaymentInput);
  }

  @Query(() => PaymentPaginationResultOutput, { name: 'payments' })
  @UseGuards(JwtAuthSharedGuard)
  public findAll(@Args('filter') filter: FindAllPaymentInput) {
    return this.paymentService.findAll(filter);
  }

  @Query(() => Payment, { name: 'payment' })
  @UseGuards(JwtAuthSharedGuard)
  public findOne(@Args('id') id: string) {
    return this.paymentService.findOne({ id });
  }

  @Mutation(() => Payment)
  @UseGuards(JwtAuthSharedGuard)
  public updatePayment(
    @Args('updatePaymentInput') updatePaymentInput: UpdatePaymentInput,
  ) {
    return this.paymentService.update(updatePaymentInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthSharedGuard)
  public removePayment(@Args('id') id: string) {
    this.paymentService.remove(id);
    return { done: true };
  }
}
