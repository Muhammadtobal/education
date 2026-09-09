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
import { CourseType } from 'src/shared/enums/course_type.enum';
import { PlanCoupon } from 'src/plan_coupon/entities/plan_coupon.entity';

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

  @Column('bigint')
  @Field()
  teacher_id: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  @Field(() => Float)
  price: number;

  @Column({
    type: 'float',
    default: 0,
  })
  @Field(() => Float)
  rating: number;

  @Column({
    type: 'float',
    default: 0,
  })
  @Field(() => Float)
  teacher_share: number;

  @Column({
    type: 'int',
    default: 0,
  })
  @Field(() => Int)
  count_days: number;

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

  @ManyToOne(() => Teacher, (teacher) => teacher.courses)
  @JoinColumn({ name: 'teacher_id' })
  @Field(() => Teacher, { nullable: true })
  teacher?: Teacher;

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

  @OneToMany(() => PlanCoupon, (plan_coupon) => plan_coupon.course)
  plan_coupons: PlanCoupon[];

  @OneToMany(() => Discussion, (discussion) => discussion.course)
  discussions: Discussion[];

  @OneToMany(() => PaymentCode, (payment_code) => payment_code.course)
  payment_codes: PaymentCode[];
}
