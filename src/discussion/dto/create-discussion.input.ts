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
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  course_id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  description: string;

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
  @IsNumberString()
  @Field({ nullable: true })
  user_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  employee_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  teacher_id?: string;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  active?: boolean;
}
