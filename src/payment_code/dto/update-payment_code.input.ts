import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { CreatePaymentCodeInput } from './create-payment_code.input';

@InputType()
export class UpdatePaymentCodeInput extends PartialType(
  CreatePaymentCodeInput,
) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}
