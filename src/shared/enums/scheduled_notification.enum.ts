import { registerEnumType } from '@nestjs/graphql';

export enum ScheduledNotificationType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

registerEnumType(ScheduledNotificationType, {
  name: 'ScheduledNotificationType',
  description: 'Scheduled notification type (daily, weekly, or monthly)',
});
