import { Field, InputType } from "@nestjs/graphql";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from "class-validator";
import GraphQLJSON from "graphql-type-json";

import { Type } from "class-transformer";
import {
  ListOfIdsInput,
  MatchInput,
  MaxDateInput,
  MinDateInput,
  PaginationInput,
  RangeDateInput,
  SingleDateInput,
  SingleIdInput,
  SortInput,
} from "src/shared/types/graphql-input-types";

import { IsSingleDateOrRange } from "src/shared/decorators/is-single-date-or-range.decorator";
import { IsSingleIdOrList } from "src/shared/decorators/is-single-id-or-list.decorator";
import { Gender } from "src/shared/enums/gender.enum";
@InputType()
export class FindAllUserInput {
  @IsOptional()
  @IsObject()
  @IsSingleIdOrList()
  @Field(() => GraphQLJSON, { nullable: true })
  id?: SingleIdInput | ListOfIdsInput;

  @IsOptional()
  @IsObject()
  @Type(() => MatchInput)
  @Field(() => MatchInput, { nullable: true })
  full_name?: MatchInput;

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  select?: string[];

  @IsOptional()
  @IsObject()
  @Type(() => MatchInput)
  @Field(() => MatchInput, { nullable: true })
  phone?: MatchInput;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  active?: boolean;

  @IsOptional()
  @Type(() => MatchInput)
  @Field(() => MatchInput, { nullable: true })
  gender?: MatchInput;

  @IsOptional()
  @IsObject()
  @IsSingleDateOrRange()
  @Field(() => GraphQLJSON, { nullable: true })
  created_at?: SingleDateInput | RangeDateInput | MaxDateInput | MinDateInput;

  @IsOptional()
  @IsObject()
  @IsSingleDateOrRange()
  @Field(() => GraphQLJSON, { nullable: true })
  updated_at?: SingleDateInput | RangeDateInput | MaxDateInput | MinDateInput;

  @IsOptional()
  @IsObject()
  @IsSingleIdOrList()
  @Field(() => GraphQLJSON, { nullable: true })
  city_id?: SingleIdInput | ListOfIdsInput;

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
  lang?: MatchInput;
}
