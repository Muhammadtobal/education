import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginationMetadata {
  constructor(
    total: number,
    current_page: number,
    items_per_page: number,
    total_pages: number,
  ) {
    this.total = total;
    this.current_page = current_page;
    this.items_per_page = items_per_page;
    this.total_pages = total_pages;
  }

  @Field(() => Int, { nullable: true })
  total?: number;

  @Field(() => Int, { nullable: true })
  current_page?: number;

  @Field(() => Int, { nullable: true })
  items_per_page?: number;

  @Field(() => Int, { nullable: true })
  total_pages?: number;
}
