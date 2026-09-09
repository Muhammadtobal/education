import { PaymentCode } from 'src/payment_code/entities/payment_code.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import GraphQLJSON from 'graphql-type-json';

import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

import { Course } from 'src/course/entities/course.entity';
import { ContentType } from 'src/shared/enums/content_type.enum';
import { PlanCourse } from 'src/plan_course/entities/plan_course.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { Exam } from 'src/exam/entities/exam.entity';
import { PlanCoupon } from 'src/plan_coupon/entities/plan_coupon.entity';

@ObjectType()
@Entity()
export class Content {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('bigint')
  @Field()
  course_id: string;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  exam_id?: string;

  @Column({ type: 'varchar', nullable: true, length: 255 })
  @Field({ nullable: true })
  url?: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  title: string;

  @Column({
    type: 'enum',
    enum: ContentType,
  })
  @Field(() => ContentType)
  content_type: ContentType;

  @Column({ type: 'bigint', nullable: true })
  @Field({ nullable: true })
  parent_id?: string;

  @Column('simple-json', { nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  content_info?: Record<string, any>;

  @Column('boolean', { default: true })
  @Field(() => Boolean)
  active: boolean;

  @Column('boolean')
  @Field(() => Boolean)
  is_free: boolean;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  @Field(() => Float)
  price: number;

  @Column({
    type: 'int',
    default: 0,
  })
  @Field(() => Int)
  count_days: number;

  @Column('boolean', { default: false })
  @Field(() => Boolean)
  is_pdf: boolean;

  @Column('boolean', { default: false })
  @Field(() => Boolean)
  has_children: boolean;

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

  @ManyToOne(() => Content, (content) => content.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  @Field(() => Content, { nullable: true })
  parent?: Content;

  @ManyToOne(() => Exam, (exam) => exam.contents, {
    nullable: true,
  })
  @JoinColumn({ name: 'exam_id' })
  @Field(() => Exam, { nullable: true })
  exam?: Exam;

  @OneToMany(() => Content, (content) => content.parent)
  @Field(() => [Content], { nullable: true })
  children?: Content[];

  @ManyToOne(() => Course, (course) => course.contents)
  @JoinColumn({ name: 'course_id' })
  @Field(() => Course, { nullable: true })
  course?: Course;

  @OneToMany(() => PlanCourse, (plan_course) => plan_course.content)
  plan_courses: PlanCourse[];

  @OneToMany(() => Subscription, (subscription) => subscription.content)
  subscriptions: Subscription[];

  @OneToMany(() => PaymentCode, (payment_code) => payment_code.content)
  payment_codes: PaymentCode[];

  @OneToMany(() => PlanCoupon, (plan_coupon) => plan_coupon.content)
  plan_coupons: PlanCoupon[];
}
