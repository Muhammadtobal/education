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
import { Course } from 'src/course/entities/course.entity';
import { Content } from 'src/content/entities/content.entity';

@ObjectType()
@Entity()
export class PlanCourse {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('bigint')
  @Field()
  plan_id: string;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  course_id?: string;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  content_id?: string;

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

  @ManyToOne(() => Course, (course) => course.plan_courses)
  @JoinColumn({ name: 'course_id' })
  @Field(() => Course, { nullable: true })
  course?: Course;

  @ManyToOne(() => Content, (content) => content.plan_courses)
  @JoinColumn({ name: 'content_id' })
  @Field(() => Content, { nullable: true })
  content?: Content;

  @ManyToOne(() => Plan, (plan) => plan.plan_courses)
  @JoinColumn({ name: 'plan_id' })
  @Field(() => Plan, { nullable: true })
  plan?: Plan;
}
