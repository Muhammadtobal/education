import { PlanCoupon } from 'src/plan_coupon/entities/plan_coupon.entity';
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
import { PlanType } from 'src/shared/enums/plan_type.enum';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@ObjectType()
@Entity()
export class Plan {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  name: string;

  @Column({ type: 'bigint' })
  @Field()
  vendor_id: string;

  @Column({
    type: 'enum',
    enum: PlanType,
  })
  @Field(() => PlanType)
  plan_type: PlanType;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  end_date?: Date;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  @Field(() => Float)
  price: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  @Field(() => Float, { nullable: true })
  days?: number;

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

  @ManyToOne(() => Vendor, (vendor) => vendor.plans)
  @JoinColumn({ name: 'vendor_id' })
  @Field(() => Vendor, { nullable: true })
  vendor?: Vendor;

  @OneToMany(() => PlanCourse, (plan_course) => plan_course.plan)
  plan_courses: PlanCourse[];

  @OneToMany(() => PlanCoupon, (plan_coupon) => plan_coupon.plan)
  plan_coupons: PlanCoupon[];
}
