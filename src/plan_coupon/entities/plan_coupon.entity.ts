import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

import { Coupon } from 'src/coupon/entities/coupon.entity';
import { Plan } from 'src/plan/entities/plan.entity';

@ObjectType()
@Entity()
export class PlanCoupon {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('bigint')
  @Field()
  coupon_id: string;

  @Column('bigint')
  @Field()
  plan_id: string;

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

  @ManyToOne(() => Coupon, (coupon) => coupon.plan_coupons)
  @JoinColumn({ name: 'coupon_id' })
  @Field(() => Coupon, { nullable: true })
  coupon?: Coupon;

  @ManyToOne(() => Plan, (plan) => plan.plan_coupons)
  @JoinColumn({ name: 'plan_id' })
  @Field(() => Plan, { nullable: true })
  plan?: Plan;
}
