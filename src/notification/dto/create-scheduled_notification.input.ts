import { InputType, Field, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsBoolean,
  IsEmpty,
  IsObject,
} from 'class-validator';

import GraphQLJSON from 'graphql-type-json';
import { City } from 'src/city/entities/city.entity';
import { ScheduledNotificationType } from 'src/shared/enums/scheduled_notification.enum';
import { NotificationFilterDataInput } from 'src/shared/types/graphql-input-types';

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
  @IsObject()
  @Type(() => NotificationFilterDataInput)
  @Field(() => NotificationFilterDataInput, { nullable: true })
  filter_data?: {
    city?: City;
    is_user?: boolean;
  };

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  approved?: boolean;

  @IsEmpty()
  receivers_count?: number;
}
