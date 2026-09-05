import { registerEnumType } from '@nestjs/graphql';

export enum CourseType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

registerEnumType(CourseType, {
  name: 'CourseType',
  description: 'Course type (internal or external)',
});
