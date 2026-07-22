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

  @Column('varchar', { length: 255, nullable: true })
  @Field({ nullable: true })
  img_url?: string;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  user_id: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  created_at: Date;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  vendor_id: string;

  @Column('simple-json')
  @Field(() => GraphQLJSON)
  filter_data: {
    city?: City;
  } = {};

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  employee_id: string;

  @ManyToOne(() => User, (user) => user.scheduled_notifications)
  @JoinColumn({ name: 'user_id' })
  @Field(() => User, { nullable: true })
  user?: User;

  @ManyToOne(() => Employee, (employee) => employee.scheduled_notifications)
  @JoinColumn({ name: 'employee_id' })
  @Field(() => Employee, { nullable: true })
  employee?: Employee;
}
