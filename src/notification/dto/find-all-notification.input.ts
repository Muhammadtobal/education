import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import GraphQLJSON from 'graphql-type-json';

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
} from 'src/shared/types/graphql-input-types';
import { IsSingleDateOrRange } from 'src/shared/decorators/is-single-date-or-range.decorator';
import { IsSingleIdOrList } from 'src/shared/decorators/is-single-id-or-list.decorator';

@InputType()
export class FindAllNotificationInput {
  @IsOptional()
  @IsObject()
  @Type(() => MatchInput)
  @Field(() => MatchInput, { nullable: true })
  title?: MatchInput;

  @IsOptional()
  @IsObject()
  @Type(() => MatchInput)
  @Field(() => MatchInput, { nullable: true })
  notification_type?: MatchInput;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  body?: boolean;

  @IsOptional()
  @IsObject()
  @IsSingleDateOrRange()
  @Field(() => GraphQLJSON, { nullable: true })
  created_at?: SingleDateInput | RangeDateInput | MaxDateInput | MinDateInput;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  active?: boolean;

  @IsOptional()
  @IsObject()
  @IsSingleIdOrList()
  @Field(() => GraphQLJSON, { nullable: true })
  user_id?: SingleIdInput | ListOfIdsInput;

  @IsOptional()
  @IsObject()
  @IsSingleIdOrList()
  @Field(() => GraphQLJSON, { nullable: true })
  employee_id?: SingleIdInput | ListOfIdsInput;

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
