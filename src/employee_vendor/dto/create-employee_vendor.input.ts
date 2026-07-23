import { InputType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateEmployeeVendorInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  vendor_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  employee_id: string;

  @IsNotEmpty()
  @IsNumberString()
  @Field()
  level_id: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;
}
