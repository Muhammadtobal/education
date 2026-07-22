import { InputType, Int, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmpty,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateEmployeeInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  socket_id?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  refresh_token: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  fcm_token: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  hmac_secret?: string;
}
