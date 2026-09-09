import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
  EXTERNAL = 'external',
  INTERNAL = 'internal',
}

registerEnumType(NotificationType, {
  name: 'NotificationType',
  description: ' notification type (daily, weekly, or monthly)',
});
