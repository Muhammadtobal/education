import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsNotEmpty, IsObject, IsOptional } from "class-validator";
import { Type } from "class-transformer";
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
import { IsSingleDateOrRange } from "src/shared/decorators/is-single-date-or-range.decorator";
@InputType()
export class FindAllCityInput {
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
