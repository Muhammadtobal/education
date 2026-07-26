import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

import { User } from 'src/user/entities/user.entity';
import { Course } from 'src/course/entities/course.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Content } from 'src/content/entities/content.entity';

@ObjectType('UserSubscription')
@Entity()
export class Subscription {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  course_id?: string;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  content_id?: string;

  @Column('bigint')
  @Field()
  user_id: string;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  end_date?: Date;

  @Column('boolean', { default: true })
  @Field(() => Boolean)
  active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date)
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  updated_at: Date;

  @ManyToOne(() => Course, (course) => course.subscriptions)
  @JoinColumn({ name: 'course_id' })
  @Field(() => Course, { nullable: true })
  course?: Course;

  @ManyToOne(() => Content, (content) => content.subscriptions)
  @JoinColumn({ name: 'content_id' })
  @Field(() => Content, { nullable: true })
  content?: Content;

  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: 'user_id' })
  @Field(() => User, { nullable: true })
  user?: User;

  @OneToMany(() => Payment, (payment) => payment.subscription)
  payments: Payment[];
}
