import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateStoryInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  level_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  vendor_id: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  url?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  title?: string;
}
