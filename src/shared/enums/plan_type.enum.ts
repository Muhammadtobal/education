import { registerEnumType } from '@nestjs/graphql';

export enum PlanType {
  DAILY = 'daily',
  SEASONAL = 'seasonal',
  FREE = 'free',
}

registerEnumType(PlanType, {
  name: 'PlanType',
  description: 'Plan type (daily or seasonal)',
});
