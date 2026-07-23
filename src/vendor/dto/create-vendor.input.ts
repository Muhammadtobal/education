import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateVendorInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  phone: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  balance?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  review_count?: number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  icon?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  img_url?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
