import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { BadRequestException, UseGuards } from '@nestjs/common';

import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';

import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { PaymentPaginationResultOutput } from './dto/find-all-payment.output';
import { FindAllPaymentInput } from './dto/find-all-payment.input';

import { DoneResponseOutput } from 'src/shared/types/done-output';

import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';
import {
  getEmpId,
  getEmpVendors,
  PaymentValidationError,
} from 'src/shared/helpers';
import { GqlContext } from 'src/shared/types/context';
import { CreatePaymentResponse } from './dto/paymet-response.output';
import { JwtAuthUserGuard } from 'src/auth/guards/jwt-auth-user.guard';
import { JwtAuthEmployeeGuard } from 'src/auth/guards/jwt-auth-employee.guard';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => CreatePaymentResponse)
  @UseGuards(JwtAuthUserGuard)
  @Permissions(Operation.CREATE + Payment.name)
  public async createPayment(
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
  ) {
    return await this.paymentService.create(createPaymentInput);
  }

  @Query(() => PaymentPaginationResultOutput, { name: 'payments' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Payment.name)
  public findAll(
    @Args('filter') filter: FindAllPaymentInput,
    @Context() context: GqlContext,
  ) {
    return this.paymentService.findAll(filter);
  }

  @Query(() => Payment, { name: 'payment' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + Payment.name)
  public async findOne(@Args('id') id: string, @Context() context: GqlContext) {
    const empId = getEmpId(context.req.user);
    const vendors = getEmpVendors(context.req.user);

    const payment = await this.paymentService.findOne({ id });

    return payment;
  }

  @Mutation(() => Payment)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.UPDATE + Payment.name)
  public updatePayment(
    @Args('updatePaymentInput') updatePaymentInput: UpdatePaymentInput,
  ) {
    return this.paymentService.update(updatePaymentInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.DELETE + Payment.name)
  public removePayment(@Args('id') id: string) {
    this.paymentService.remove(id);

    return {
      done: true,
    };
  }
}
