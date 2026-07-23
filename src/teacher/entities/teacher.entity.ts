import { Discussion } from 'src/discussion/entities/discussion.entity';
import { Course } from 'src/course/entities/course.entity';
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

import { Vendor } from 'src/vendor/entities/vendor.entity';
import { City } from 'src/city/entities/city.entity';
import { TeacherVendor } from './teacher-vedor.entity';
import { Review } from 'src/review/entities/review.entity';
import { Gender } from 'src/shared/enums/gender.enum';

@ObjectType()
@Entity()
export class Teacher {
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

  @Column({ type: 'enum', enum: Gender })
  @Field()
  gender: Gender;

  @Column({ type: 'bigint' })
  @Field()
  city_id: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  description: string;

  @Column('varchar', { length: 255 })
  @Field()
  phone: string;

  @Column('simple-json', { nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  device_info?: Record<string, any>;

  @Column('varchar', { length: 255, nullable: true })
  fcm_token?: string;

  @Column('varchar', { length: 255, nullable: true })
  refresh_token?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  image_url: string;

  @Column({ type: 'double', nullable: true })
  @Field(() => Float, { nullable: true })
  count_review: number;

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

  @ManyToOne(() => City, (city) => city.teachers)
  @JoinColumn({ name: 'city_id' })
  @Field(() => City, { nullable: true })
  city?: City;

  @OneToMany(() => Course, (course) => course.teacher)
  courses: Course[];

  @OneToMany(() => Discussion, (discussion) => discussion.teacher)
  discussions: Discussion[];

  @OneToMany(() => TeacherVendor, (teacher_vendor) => teacher_vendor.teacher)
  teacher_vendors: TeacherVendor[];

  @OneToMany(() => Review, (review) => review.teacher)
  reviews: Review[];
}
