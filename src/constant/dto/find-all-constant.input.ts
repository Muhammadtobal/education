import { InputType, Field } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, IsBoolean, IsObject, IsNotEmpty } from "class-validator";
import GraphQLJSON from "graphql-type-json";
import {
  MatchInput,
  PaginationInput,
  SingleDateInput,
  RangeDateInput,
  MinDateInput,
  MaxDateInput,
  SortInput,
  MinNumberInput,
  MaxNumberInput,
  RangeNumberInput,
  SingleIdInput,
  ListOfIdsInput,
  SingleNumberInput,
} from "src/shared/types/graphql-input-types";
import { IsSingleDateOrRange } from "src/shared/decorators/is-single-date-or-range.decorator";
import { IsSingleNumberOrRange } from "src/shared/decorators/is-single-number-or-range.decorator";
import { IsSingleIdOrList } from "src/shared/decorators/is-single-id-or-list.decorator";

@InputType()
export class FindAllConstantInput {
  @IsOptional()
  @IsObject()
  @Type(() => MatchInput)
  @Field(() => MatchInput, { nullable: true })
  key?: MatchInput;

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
