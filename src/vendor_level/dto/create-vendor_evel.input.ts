import { InputType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateVendorLevelInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  vendor_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  level_id: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  active?: boolean;
}
