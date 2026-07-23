import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { CreatePlanInput } from './create-plan.input';

@InputType()
export class UpdatePlanInput extends PartialType(CreatePlanInput) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}
