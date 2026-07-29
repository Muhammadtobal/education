import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, IsBoolean, IsObject, IsNotEmpty } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
import {
  MatchInput,
  PaginationInput,
  SingleDateInput,
  RangeDateInput,
  MinDateInput,
  MaxDateInput,
  SortInput,
} from 'src/shared/types/graphql-input-types';
import { IsSingleDateOrRange } from 'src/shared/decorators/is-single-date-or-range.decorator';

@InputType()
export class FindAllPermissionInput {
  @IsOptional()
  @IsObject()
  @Type(() => MatchInput)
  @Field(() => MatchInput, { nullable: true })
  name?: MatchInput;

  @IsOptional()
  @IsObject()
  @Type(() => MatchInput)
  @Field(() => MatchInput, { nullable: true })
  description?: MatchInput;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  for_vendor?: boolean;

  @IsOptional()
  @IsObject()
  @IsSingleDateOrRange()
  @Field(() => GraphQLJSON, { nullable: true })
  created_at?: SingleDateInput | RangeDateInput | MaxDateInput | MinDateInput;

  @IsNotEmpty()
  @IsObject()
  @Type(() => PaginationInput)
  @Field(() => PaginationInput)
  pagination: PaginationInput;

  @IsOptional()
  @IsObject()
  @Type(() => SortInput)
  @Field(() => SortInput, { nullable: true })
  sort?: SortInput;
}
