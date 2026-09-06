import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PaymentCodeService } from './payment_code.service';
import { PaymentCode } from './entities/payment_code.entity';
import { CreatePaymentCodeInput } from './dto/create-payment_code.input';
import { UpdatePaymentCodeInput } from './dto/update-payment_code.input';
import { PaymentCodePaginationResultOutput } from './dto/find-all-payment_code.output';
import { FindAllPaymentCodeInput } from './dto/find-all-payment_code.input';
import { DoneResponseOutput } from 'src/shared/types/done-output';
import { CheckActivationPaymentCodeInput } from './dto/check-payment-code.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthSharedGuard } from 'src/auth/guards/jwt-auth-shared.guard';
import { JwtAuthEmployeeGuard } from 'src/auth/guards/jwt-auth-employee.guard';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { Operation } from 'src/shared/enums/operation.enum';

@Resolver(() => PaymentCode)
export class PaymentCodeResolver {
  constructor(private readonly paymentCodeService: PaymentCodeService) {}

  @Mutation(() => [PaymentCode])
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.CREATE + PaymentCode.name)
  public createPaymentCode(
    @Args('createPaymentCodeInput')
    createPaymentCodeInput: CreatePaymentCodeInput,
  ) {
    return this.paymentCodeService.create(createPaymentCodeInput);
  }

  @Query(() => PaymentCodePaginationResultOutput, { name: 'payment_codes' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + PaymentCode.name)
  public findAll(@Args('filter') filter: FindAllPaymentCodeInput) {
    return this.paymentCodeService.findAll(filter);
  }

  @Query(() => PaymentCode, { name: 'payment_code' })
  @UseGuards(JwtAuthSharedGuard)
  @Permissions(Operation.GET + PaymentCode.name)
  public findOne(@Args('id') id: string) {
    return this.paymentCodeService.findOne({ id });
  }

  @Mutation(() => PaymentCode)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.UPDATE + PaymentCode.name)
  public updatePaymentCode(
    @Args('updatePaymentCodeInput')
    updatePaymentCodeInput: UpdatePaymentCodeInput,
  ) {
    return this.paymentCodeService.update(updatePaymentCodeInput);
  }

  @Mutation(() => DoneResponseOutput)
  @UseGuards(JwtAuthEmployeeGuard)
  @Permissions(Operation.DELETE + PaymentCode.name)
  public removePaymentCode(@Args('id') id: string) {
    this.paymentCodeService.remove(id);
    return { done: true };
  }

  @Mutation(() => PaymentCode)
  @UseGuards(JwtAuthSharedGuard)
  public checkActivationPaymentCode(
    @Args('checkActivationPaymentCodeInput')
    checkActivationPaymentCodeInput: CheckActivationPaymentCodeInput,
  ) {
    return this.paymentCodeService.checkActivationPaymentCode(
      checkActivationPaymentCodeInput,
    );
  }
}
