import { Field, ObjectType } from "@nestjs/graphql";
import { City } from "../entities/city.entity";
import { PaginationMetadata } from "src/shared/types/pagination-metadata";

@ObjectType()
export class CityPaginationResultOutput {
  @Field(() => [City])
  items: City[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
