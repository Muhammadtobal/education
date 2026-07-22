import { InputType, Int, Field, Float } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDecimal,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreatePaymentInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  video_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  user_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Float)
  price: number;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
