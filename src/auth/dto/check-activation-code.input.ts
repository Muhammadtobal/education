import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CheckActivationCodeInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  code: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  fcm_token?: string;

  @IsOptional()
  @Field(() => GraphQLJSON, { nullable: true })
  device_info?: Record<string, any>;
}
