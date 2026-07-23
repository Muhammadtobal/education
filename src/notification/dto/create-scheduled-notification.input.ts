import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

import GraphQLJSON from 'graphql-type-json';
import { ScheduledNotificationType } from 'src/shared/enums/scheduled_notification.enum';

@InputType()
export class CreateScheduledNotificationInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  title: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  body: string;

  @IsNotEmpty()
  @IsInt()
  @Field(() => Int)
  count: number;

  @IsNotEmpty()
  @IsEnum(ScheduledNotificationType)
  @Field(() => ScheduledNotificationType)
  scheduled_notification_type: ScheduledNotificationType;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  active?: boolean;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  link?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  img_url?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  user_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  vendor_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  employee_id?: string;

  @IsOptional()
  @Field(() => GraphQLJSON, { nullable: true })
  filter_data?: {
    city?: any;
  };
}
