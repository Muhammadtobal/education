import { InputType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateLevelInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @IsOptional()
  @IsNumberString()
  @Field({ nullable: true })
  parent_id?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
