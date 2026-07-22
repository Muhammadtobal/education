import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { Notification } from './entities/notification.entity';

import { UserModule } from 'src/user/user.module';
import { CityModule } from 'src/city/city.module';

import { EmployeeModule } from 'src/employee/employee.module';
import { ScheduledNotification } from './entities/scheduled-notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, ScheduledNotification]),
    forwardRef(() => UserModule),
    forwardRef(() => CityModule),

    forwardRef(() => EmployeeModule),
  ],
  exports: [NotificationService],
  providers: [NotificationResolver, NotificationService],
})
export class NotificationModule {}
