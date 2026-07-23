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
  course_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  user_id: string;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  end_date?: Date;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  active?: boolean;
}
