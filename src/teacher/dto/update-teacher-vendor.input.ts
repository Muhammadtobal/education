import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { CreateTeacherInput } from './create-teacher.input';
import { CreateTeacherVendorInput } from './create-teacher-vendor.input';

@InputType()
export class UpdateTeacherVendorInput extends PartialType(
  CreateTeacherVendorInput,
) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}
