import { InputType, Field } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, IsObject, IsNotEmpty } from "class-validator";
import GraphQLJSON from "graphql-type-json";
import {
  MatchInput,
  PaginationInput,
  SingleDateInput,
  RangeDateInput,
  MinDateInput,
  MaxDateInput,
  SortInput,
  SingleIdInput,
  ListOfIdsInput,
} from "src/shared/types/graphql-input-types";
import { IsSingleDateOrRange } from "src/shared/decorators/is-single-date-or-range.decorator";
import { IsSingleIdOrList } from "src/shared/decorators/is-single-id-or-list.decorator";

@InputType()
export class FindAllEmployeePermissionInput {
  @IsOptional()
  @IsObject()
  @IsSingleIdOrList()
  @Field(() => GraphQLJSON, { nullable: true })
  employee_id?: SingleIdInput | ListOfIdsInput;

  @IsOptional()
  @IsObject()
  @IsSingleIdOrList()
  @Field(() => GraphQLJSON, { nullable: true })
  permission_id?: SingleIdInput | ListOfIdsInput;

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
