import { InputType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateSubscriptionInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  user_id: string;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  end_date?: Date;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  course_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  content_id?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  active?: boolean;
}
