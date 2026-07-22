import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { City } from 'src/city/entities/city.entity';

@InputType()
export class NotificationFilterDataInput {
  @IsOptional()
  @IsObject()
  @Type(() => City)
  @Field(() => CityInput)
  city?: City;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  is_user?: boolean;
}

@InputType()
export class CityInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;
}

@InputType()
export class MatchInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  value: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  op: 'full' | 'partial';
}

@InputType()
export class SingleDateInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  value: string;
}

@InputType()
export class RangeDateInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  min: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  max: string;
}

@InputType()
export class MinDateInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  min: string;
}

@InputType()
export class MaxDateInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  max: string;
}

@InputType()
export class SingleNumberInput {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int)
  value: number;
}

export class MinNumberInput {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int)
  min: number;
}

export class MaxNumberInput {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int)
  max: number;
}

@InputType()
export class RangeNumberInput {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int)
  min: number;

  @IsNotEmpty()
  @IsInt()
  @Field(() => Int)
  max: number;
}
@InputType()
export class SingleIdInput {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  value: string;
}

@InputType()
export class ListOfIdsInput {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type()
  @Field(() => [String])
  ids: string[];
}
@InputType()
export class PaginationInput {
  @IsNotEmpty()
  @IsInt()
  @Field(() => Int)
  limit: number;

  @IsNotEmpty()
  @IsInt()
  @Field(() => Int)
  page: number;
}

@InputType()
export class SortInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  by: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  type: 'DESC' | 'ASC';
}
