import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import GraphQLJSON from 'graphql-type-json';
import {
  ListOfIdsInput,
  MatchInput,
  RangeDateInput,
  RangeNumberInput,
  SingleDateInput,
  SingleIdInput,
  SingleNumberInput,
  PaginationInput,
  SortInput,
  MaxDateInput,
  MinDateInput,
} from 'src/shared/types/graphql-input-types';
import { IsSingleDateOrRange } from 'src/shared/decorators/is-single-date-or-range.decorator';
import { IsSingleIdOrList } from 'src/shared/decorators/is-single-id-or-list.decorator';
import { IsSingleNumberOrRange } from 'src/shared/decorators/is-single-number-or-range.decorator';

@InputType()
export class FindAllLevelInput {
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

  @IsOptional()
  @IsObject()
  @Type(() => MatchInput)
  @Field(() => MatchInput, { nullable: true })
  name?: MatchInput;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;

  @IsOptional()
  @IsObject()
  @IsSingleIdOrList()
  @Field(() => GraphQLJSON, { nullable: true })
  parent_id?: SingleIdInput | ListOfIdsInput;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  parent_level?: boolean;

  @IsOptional()
  @IsObject()
  @IsSingleDateOrRange()
  @Field(() => GraphQLJSON, { nullable: true })
  created_at?: SingleDateInput | RangeDateInput | MaxDateInput | MinDateInput;
}
