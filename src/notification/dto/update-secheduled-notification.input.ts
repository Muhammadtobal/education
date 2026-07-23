import { IsNotEmpty, IsNumberString } from 'class-validator';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

import { CreateNotificationInput } from './create-notification.input';
import { CreateScheduledNotificationInput } from './create-scheduled-notification.input';

@InputType()
export class UpdateScheduledNotificationInput extends PartialType(
  CreateScheduledNotificationInput,
) {
  @IsNotEmpty()
  @IsNumberString()
  @Field()
  id: string;
}
