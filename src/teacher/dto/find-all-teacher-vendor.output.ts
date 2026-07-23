import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { Teacher } from '../entities/teacher.entity';
import { TeacherVendor } from '../entities/teacher-vedor.entity';

@ObjectType()
export class TeacherVendorPaginationResultOutput {
  @Field(() => [TeacherVendor])
  items: TeacherVendor[];

  @Field(() => PaginationMetadata)
  meta: PaginationMetadata;
}
