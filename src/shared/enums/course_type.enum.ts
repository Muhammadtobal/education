import { registerEnumType } from '@nestjs/graphql';

export enum CourseType {
  THEORETICAL = 'theoretical',
  PRACTICAL = 'practical',
}

registerEnumType(CourseType, {
  name: 'CourseType',
  description: 'Course type (internal or external)',
});
