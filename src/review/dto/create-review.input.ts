import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateReviewInput {
  // Required Fields

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  user_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Float)
  value: number;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  course_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  vendor_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  teacher_id?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  comment?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
