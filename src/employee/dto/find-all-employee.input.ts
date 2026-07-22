import { InputType, Field } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, IsBoolean, IsObject, IsNotEmpty } from "class-validator";
import { IsSingleDateOrRange } from "src/shared/decorators/is-single-date-or-range.decorator";
import GraphQLJSON from "graphql-type-json";

import {
  MatchInput,
  MaxDateInput,
  MinDateInput,
  PaginationInput,
  RangeDateInput,
  SingleDateInput,
  SortInput,
} from "src/shared/types/graphql-input-types";

@InputType()
export class FindAllEmployeeInput {
  @IsOptional()
  @IsObject()
  @Type(() => MatchInput)
  @Field(() => MatchInput, { nullable: true })
  username?: MatchInput;

  @IsOptional()
  @IsObject()
  @Type(() => MatchInput)
  @Field(() => MatchInput, { nullable: true })
  full_name?: MatchInput;

  @IsOptional()
  @IsObject()
  @Type(() => MatchInput)
  @Field(() => MatchInput, { nullable: true })
  account_type?: MatchInput;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;

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
  @IsSingleDateOrRange()
  @Field(() => GraphQLJSON, { nullable: true })
  created_at?: SingleDateInput | RangeDateInput | MaxDateInput | MinDateInput;
}
