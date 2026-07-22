import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsNotEmpty, IsObject, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import GraphQLJSON from "graphql-type-json";
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
} from "src/shared/types/graphql-input-types";
import { IsSingleDateOrRange } from "src/shared/decorators/is-single-date-or-range.decorator";
import { IsSingleIdOrList } from "src/shared/decorators/is-single-id-or-list.decorator";
import { IsSingleNumberOrRange } from "src/shared/decorators/is-single-number-or-range.decorator";

@InputType()
export class FindAllEmployeeVendorInput {
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
  @IsSingleIdOrList()
  @Field(() => GraphQLJSON, { nullable: true })
  vendor_id?: SingleIdInput | ListOfIdsInput;

  @IsOptional()
  @IsObject()
  @IsSingleIdOrList()
  @Field(() => GraphQLJSON, { nullable: true })
  employee_id?: SingleIdInput | ListOfIdsInput;

  @IsOptional()
  @IsObject()
  @IsSingleIdOrList()
  @Field(() => GraphQLJSON, { nullable: true })
  level_id?: SingleIdInput | ListOfIdsInput;
}