import { PaymentCode } from 'src/payment_code/entities/payment_code.entity';
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
import { CourseTeacher } from './course_teacher.entity';
import { CourseType } from 'src/shared/enums/course_type.enum';

@ObjectType()
@Entity()
export class Course {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  name: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  url: string;

  @Column({ type: 'text' })
  @Field()
  description: string;

  @Column('bigint')
  @Field()
  level_id: string;

  @Column({
    type: 'float',
    default: 0,
  })
  @Field(() => Float)
  rating: number;

  @Column({
    type: 'enum',
    enum: CourseType,
  })
  course_type: CourseType;

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

  @ManyToOne(() => Level, (level) => level.courses)
  @JoinColumn({ name: 'level_id' })
  @Field(() => Level, { nullable: true })
  level?: Level;

  @OneToMany(() => PlanCourse, (plan_course) => plan_course.course)
  plan_courses: PlanCourse[];

  @OneToMany(() => Exam, (exam) => exam.course)
  exams: Exam[];

  @OneToMany(() => Subscription, (subscription) => subscription.course)
  subscriptions: Subscription[];

  @OneToMany(() => Content, (content) => content.course)
  contents: Content[];

  @OneToMany(() => Review, (review) => review.course)
  reviews: Review[];

  @OneToMany(() => CourseTeacher, (course_teacher) => course_teacher.course)
  course_teachers: CourseTeacher[];

  @OneToMany(() => Discussion, (discussion) => discussion.course)
  discussions: Discussion[];

  @OneToMany(() => PaymentCode, (payment_code) => payment_code.course)
  payment_codes: PaymentCode[];
}
