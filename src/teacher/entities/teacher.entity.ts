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

@ObjectType()
@Entity()
export class Teacher {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  name: string;

  @Column({ type: 'bigint' })
  @Field()
  vendor_id: string;

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

  @ManyToOne(() => Vendor, (vendor) => vendor.teachers)
  @JoinColumn({ name: 'vendor_id' })
  @Field(() => Vendor, { nullable: true })
  vendor?: Vendor;

  @ManyToOne(() => City, (city) => city.teachers)
  @JoinColumn({ name: 'city_id' })
  @Field(() => City, { nullable: true })
  city?: City;

  @OneToMany(() => Course, (course) => course.teacher)
  courses: Course[];

  @OneToMany(() => Discussion, (discussion) => discussion.teacher)
  discussions: Discussion[];
}
