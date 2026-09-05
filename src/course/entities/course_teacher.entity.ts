import { Content } from 'src/content/entities/content.entity';
import { Exam } from 'src/exam/entities/exam.entity';
import { PlanCourse } from 'src/plan_course/entities/plan_course.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

import { Level } from 'src/level/entities/level.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { Review } from 'src/review/entities/review.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Discussion } from 'src/discussion/entities/discussion.entity';
import { Course } from './course.entity';

@ObjectType()
@Entity()
export class CourseTeacher {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('bigint')
  @Field()
  teacher_id: string;

  @Column('bigint')
  @Field()
  course_id: string;

  @Column({
    type: 'float',
    default: 0,
  })
  @Field(() => Float)
  teacher_share: number;

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

  @ManyToOne(() => Teacher, (teacher) => teacher.course_teachers)
  @JoinColumn({ name: 'teacher_id' })
  @Field(() => Teacher, { nullable: true })
  teacher?: Teacher;

  @ManyToOne(() => Course, (course) => course.course_teachers)
  @JoinColumn({ name: 'course_id' })
  @Field(() => Course, { nullable: true })
  course?: Course;
}
