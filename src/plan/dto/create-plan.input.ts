import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

import { PlanType } from 'src/shared/enums/plan_type.enum';

@InputType()
export class CreatePlanInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  vendor_id: string;

  @IsNotEmpty()
  @IsEnum(PlanType)
  @Field(() => PlanType)
  plan_type: PlanType;

  @IsNotEmpty()
  @Field(() => Date)
  end_date: Date;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Float)
  price: number;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
