import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Coupon } from 'src/coupon/entities/coupon.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
@Entity()
export class UserCoupon {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('bigint')
  @Field()
  user_id: string;

  @Column('bigint')
  @Field()
  coupon_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field(() => Date)
  created_at: Date;

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  active: boolean;

  @ManyToOne(() => User, (user) => user.user_coupons)
  @JoinColumn({ name: 'user_id' })
  @Field(() => User, { nullable: true })
  user?: User;

  @ManyToOne(() => Coupon, (coupon) => coupon.user_coupons)
  @JoinColumn({ name: 'coupon_id' })
  @Field(() => Coupon, { nullable: true })
  coupon?: Coupon;
}
