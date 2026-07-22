import { registerEnumType } from '@nestjs/graphql';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}
registerEnumType(DiscountType, {
  name: 'DiscountType',
  description: 'DiscountType   (fixed or percentage)',
});
