import { PlanCoupon } from 'src/plan_coupon/entities/plan_coupon.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

import { DiscountType } from 'src/shared/enums/discount_type.enum';
import { User } from 'src/user/entities/user.entity';
import { UserCoupon } from './user_coupon.entity';

@ObjectType()
@Entity()
export class Coupon {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Field()
  code: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  user_id?: string;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  usage_limit?: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  used_count: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Field(() => Float)
  discount_value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @Field(() => Float, { nullable: true })
  min_order_amount?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @Field(() => Float, { nullable: true })
  max_discount?: number;

  @Column({ type: 'enum', enum: DiscountType })
  @Field(() => DiscountType)
  discount_type: DiscountType;

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  active: boolean;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  starts_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Field(() => Date, { nullable: true })
  expires_at?: Date;

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

  @ManyToOne(() => User, (user) => user.coupons)
  @JoinColumn({ name: 'user_id' })
  @Field(() => User, { nullable: true })
  user?: User;

  @OneToMany(() => UserCoupon, (user_coupon) => user_coupon.coupon)
  user_coupons: UserCoupon[];

  @OneToMany(() => PlanCoupon, (plan_coupon) => plan_coupon.coupon)
  plan_coupons: PlanCoupon[];
}
