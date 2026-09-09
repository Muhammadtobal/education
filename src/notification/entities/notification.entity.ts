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
import { NotificationType } from 'src/shared/enums/notification_type.enum';

@Entity()
@ObjectType()
export class Notification {
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

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  teacher_id: string;

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
  @Field()
  approved: boolean;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  @Field(() => NotificationType)
  notification_type: NotificationType;

  @Column('int', { width: 8, default: 1 })
  @Field(() => Int)
  receivers_count: number;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  @Field(() => User, { nullable: true })
  user?: User;

  @ManyToOne(() => Employee, (employee) => employee.notifications)
  @JoinColumn({ name: 'employee_id' })
  @Field(() => Employee, { nullable: true })
  employee?: Employee;
}
