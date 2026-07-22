import { InputType, Int, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Column } from 'typeorm';
import GraphQLJSON from 'graphql-type-json';
import { City } from 'src/city/entities/city.entity';

import { NotificationFilterDataInput } from 'src/shared/types/graphql-input-types';

@InputType()
export class CreateNotificationInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  title: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  body: string;

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
  is_property?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  img_url?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  link?: string;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  global?: boolean;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  vendor_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  user_id?: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  employee_id?: string;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  approved?: boolean;

  @IsOptional()
  @IsObject()
  @Field(() => GraphQLJSON, { nullable: true })
  extraData?: Record<string, string>;

  @IsEmpty()
  receivers_count?: number;
}
