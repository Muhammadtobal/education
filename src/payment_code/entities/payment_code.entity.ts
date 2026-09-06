import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

import { Plan } from 'src/plan/entities/plan.entity';
import { Content } from 'src/content/entities/content.entity';
import { Course } from 'src/course/entities/course.entity';

@ObjectType()
@Entity()
export class PaymentCode {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  code: string;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  plan_id?: string;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  content_id?: string;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  course_id?: string;

  @Column({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  starts_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  expires_at?: Date;

  @Column({ type: 'boolean', default: true })
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

  @ManyToOne(() => Plan, (plan) => plan.payment_codes)
  @JoinColumn({ name: 'plan_id' })
  @Field(() => Plan, { nullable: true })
  plan?: Plan;

  @ManyToOne(() => Content, (content) => content.payment_codes)
  @JoinColumn({ name: 'content_id' })
  @Field(() => Content, { nullable: true })
  content?: Content;

  @ManyToOne(() => Course, (course) => course.payment_codes)
  @JoinColumn({ name: 'course_id' })
  @Field(() => Course, { nullable: true })
  course?: Course;
}
