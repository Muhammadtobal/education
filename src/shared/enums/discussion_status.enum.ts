import { registerEnumType } from '@nestjs/graphql';

export enum DiscussionStatus {
  OPEN = 'open',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
  CLOSED = 'closed',
}

registerEnumType(DiscussionStatus, {
  name: 'DiscussionStatus',
  description: 'Discussion status',
});
