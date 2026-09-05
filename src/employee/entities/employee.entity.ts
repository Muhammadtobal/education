import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EmployeePermission } from 'src/employee_permission/entities/employee_permission.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { City } from 'src/city/entities/city.entity';
import GraphQLJSON from 'graphql-type-json';
import { ScheduledNotification } from 'src/notification/entities/scheduled_notification.entity';
import { Gender } from 'src/shared/enums/gender.enum';
import { Discussion } from 'src/discussion/entities/discussion.entity';

@Entity()
@ObjectType()
export class Employee {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('varchar', { length: 255 })
  @Field()
  phone: string;

  @Column({ type: 'enum', enum: Gender })
  @Field()
  gender: Gender;

  @Column('varchar', { length: 255 })
  @Field()
  full_name: string;

  @Column('boolean', { default: true })
  @Field(() => Boolean)
  active: boolean;

  @Column('bigint')
  @Field()
  city_id: string;

  @Column('simple-json', { nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  device_info?: Record<string, any>;

  @Column('varchar', { length: 255, nullable: true })
  fcm_token?: string;

  @Column('varchar', { length: 255, nullable: true })
  refresh_token?: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  created_at: Date;
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  updated_at: Date;

  @ManyToOne(() => City, (city) => city.employees)
  @JoinColumn({ name: 'city_id' })
  @Field(() => City, { nullable: true })
  city?: City;

  @OneToMany(
    () => EmployeePermission,
    (employee_permission) => employee_permission.employee,
  )
  @Field(() => [EmployeePermission], { nullable: true })
  employee_permissions: EmployeePermission[];

  @OneToMany(() => Notification, (notification) => notification.employee)
  notifications: Notification[];

  @OneToMany(
    () => ScheduledNotification,
    (scheduled_notification) => scheduled_notification.employee,
  )
  scheduled_notifications: ScheduledNotification[];

  @OneToMany(() => Discussion, (discussion) => discussion.employee)
  discussions: Discussion[];
}
