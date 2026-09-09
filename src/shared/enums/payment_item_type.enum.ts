import { registerEnumType } from '@nestjs/graphql';

export enum PaymentItemType {
  CONTENT = 'content',
  COURSE = 'course',
  PLAN = 'plan',
}

registerEnumType(PaymentItemType, {
  name: 'PaymentItemType',
  description: 'PaymentItemType type (course or CONTENT)',
});
