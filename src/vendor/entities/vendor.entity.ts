import { Story } from 'src/story/entities/story.entity';
import { EmployeeVendor } from 'src/employee_vendor/entities/employee_vendor.entity';
import { VendorLevel } from 'src/vendor_level/entities/vendor_level.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
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
import { Plan } from 'src/plan/entities/plan.entity';
import { Course } from 'src/course/entities/course.entity';
import { TeacherVendor } from 'src/teacher/entities/teacher-vendor.entity';
import { Review } from 'src/review/entities/review.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { ScheduledNotification } from 'src/notification/entities/scheduled_notification.entity';

@ObjectType()
@Entity()
export class Vendor {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  name: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  @Field(() => Float)
  balance: number;

  @Column({
    type: 'float',
    default: 0,
  })
  @Field(() => Float)
  review_count: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  icon: string;

  @Column('varchar', { length: 255 })
  @Field()
  phone: string;

  @Column('varchar', { length: 255, nullable: true })
  @Field({ nullable: true })
  img_url?: string;

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

  @OneToMany(() => VendorLevel, (vendor_level) => vendor_level.vendor)
  vendor_levels: VendorLevel[];

  @OneToMany(() => EmployeeVendor, (employee_vendor) => employee_vendor.vendor)
  employee_vendors: EmployeeVendor[];

  @OneToMany(() => Plan, (plan) => plan.vendor)
  plans: Plan[];

  @OneToMany(() => Course, (course) => course.vendor)
  courses: Course[];

  @OneToMany(() => TeacherVendor, (teacher_vendor) => teacher_vendor.vendor)
  teacher_vendors: TeacherVendor[];

  @OneToMany(() => Story, (story) => story.vendor)
  stories: Story[];

  @OneToMany(() => Payment, (payment) => payment.vendor)
  payments: Payment[];

  @OneToMany(
    () => ScheduledNotification,
    (scheduled_notification) => scheduled_notification.vendor,
  )
  scheduled_notifications: ScheduledNotification[];
}
