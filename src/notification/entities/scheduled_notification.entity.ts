import { ObjectType, Field, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { City } from 'src/city/entities/city.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { User } from 'src/user/entities/user.entity';
import { ScheduledNotificationType } from 'src/shared/enums/scheduled_notification.enum';

@Entity()
@ObjectType()
export class ScheduledNotification {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('varchar', { length: 255 })
  @Field()
  title: string;

  @Column('varchar', { length: 255 })
  @Field()
  body: string;

  @Column('boolean', { default: true })
  @Field()
  active: boolean;

  @Column('varchar', { length: 255, nullable: true })
  @Field({ nullable: true })
  link?: string;

  @Column('int')
  @Field(() => Int)
  count: number;

  @Column('int', { default: 0 })
  @Field(() => Int)
  executed_count: number;

  @Column('timestamp', { nullable: true })
  @Field({ nullable: true })
  next_run_at?: Date;

  @Column('timestamp', { nullable: true })
  @Field({ nullable: true })
  last_run_at?: Date;

  @Column({
    type: 'enum',
    enum: ScheduledNotificationType,
  })
  @Field(() => ScheduledNotificationType)
  scheduled_notification_type: ScheduledNotificationType;

  @Column('varchar', { length: 255, nullable: true })
  @Field({ nullable: true })
  img_url?: string;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  user_id: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  created_at: Date;

  @Column('simple-json')
  @Field(() => GraphQLJSON)
  filter_data: {
    city?: City;
  } = {};

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  employee_id: string;

  @Column('boolean', { default: false })
  @Field()
  global: boolean;

  @Column('boolean', { default: false })
  @Field(() => Boolean)
  approved: boolean;

  @Column('int', { width: 8, default: 1 })
  @Field(() => Int)
  receivers_count: number;

  @ManyToOne(() => User, (user) => user.scheduled_notifications)
  @JoinColumn({ name: 'user_id' })
  @Field(() => User, { nullable: true })
  user?: User;

  @ManyToOne(() => Employee, (employee) => employee.scheduled_notifications)
  @JoinColumn({ name: 'employee_id' })
  @Field(() => Employee, { nullable: true })
  employee?: Employee;
}
