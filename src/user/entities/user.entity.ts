import { LoginHistory } from 'src/login_history/entities/login_history.entity';
import { Discussion } from 'src/discussion/entities/discussion.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Gender } from 'src/shared/enums/gender.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import GraphQLJSON from 'graphql-type-json';
import { City } from 'src/city/entities/city.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Review } from 'src/review/entities/review.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { Level } from 'src/level/entities/level.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { UserCoupon } from 'src/coupon/entities/user_coupon.entity';
import { Coupon } from 'src/coupon/entities/coupon.entity';
import { ExamUser } from 'src/exam/entities/exam-user.entity';
import { AnswerUser } from 'src/answer/entities/answer-user.entity';
import { ScheduledNotification } from 'src/notification/entities/scheduled-notification.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;
  @Column('varchar', { length: 255 })
  @Field()
  full_name: string;

  @Column('varchar', { length: 255 })
  @Field()
  phone: string;

  @Column({ type: 'enum', enum: Gender })
  @Field()
  gender: Gender;

  @Column('varchar', { length: 255, nullable: true })
  @Field({ nullable: true })
  img_url?: string;

  @Column('boolean', { default: true })
  @Field()
  active: boolean;

  @Column('simple-json', { nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  device_info?: Record<string, any>;

  @Column('varchar', { length: 255, nullable: true })
  fcm_token?: string;

  @Column('varchar', { length: 255, nullable: true })
  refresh_token?: string;

  @Column('varchar', { length: 2, default: 'ar' })
  @Field()
  lang: string;

  @Column('bigint')
  @Field()
  city_id: string;

  @Column('bigint')
  @Field()
  level_id: string;

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

  @ManyToOne(() => City, (city) => city.users)
  @JoinColumn({ name: 'city_id' })
  @Field(() => City, { nullable: true })
  city?: City;

  @ManyToOne(() => Level, (level) => level.users)
  @JoinColumn({ name: 'level_id' })
  @Field(() => Level, { nullable: true })
  level?: Level;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @OneToMany(() => Discussion, (discussion) => discussion.user)
  discussions: Discussion[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => UserCoupon, (user_coupon) => user_coupon.user)
  user_coupons: UserCoupon[];

  @OneToMany(() => Coupon, (coupon) => coupon.user)
  coupons: Coupon[];

  @OneToMany(() => ExamUser, (exam_user) => exam_user.user)
  exam_users: ExamUser[];

  @OneToMany(() => AnswerUser, (answer_user) => answer_user.user)
  answer_users: AnswerUser[];

  @OneToMany(
    () => ScheduledNotification,
    (scheduled_notification) => scheduled_notification.user,
  )
  scheduled_notifications: ScheduledNotification[];

  @OneToMany(() => LoginHistory, (login_history) => login_history.user)
  login_histories: LoginHistory[];
}
