import { InputType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

import { DiscussionStatus } from 'src/shared/enums/discussion_status.enum';

@InputType()
export class CreateDiscussionInput {
  // Required Fields

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  teacher_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  course_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  description: string;

  // Optional Fields

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  title?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  url?: string;

  @IsOptional()
  @IsEnum(DiscussionStatus)
  @Field(() => DiscussionStatus, {
    nullable: true,
    defaultValue: DiscussionStatus.OPEN,
  })
  status?: DiscussionStatus;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  parent_id?: string;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  active?: boolean;
}
