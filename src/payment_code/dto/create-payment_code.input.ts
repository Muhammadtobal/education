import { InputType, Int, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

@InputType()
export class CreatePaymentCodeInput {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int)
  count: number;

  @IsNotEmpty()
  @IsString()
  @Length(4, 4)
  @Field()
  prefix: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  plan_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  content_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  course_id?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;

  @IsOptional()
  @IsDate()
  @Field(() => Date, { nullable: true })
  starts_at?: Date;

  @IsOptional()
  @IsDate()
  @Field(() => Date, { nullable: true })
  expires_at?: Date;
}
