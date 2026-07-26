import { InputType, Field, Float, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsInt,
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

  @IsOptional()
  @Field(() => Date, { nullable: true })
  end_date?: Date;

  @IsOptional()
  @IsInt()
  @Field(() => Int, { nullable: true })
  days?: number;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Float)
  price: number;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
