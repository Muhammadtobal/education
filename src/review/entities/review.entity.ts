import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

import { User } from 'src/user/entities/user.entity';
import { Course } from 'src/course/entities/course.entity';

@ObjectType()
@Entity()
export class Review {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('bigint')
  @Field()
  user_id: string;

  @Column('bigint')
  @Field()
  course_id: string;

  @Column('boolean', { default: true })
  @Field(() => Boolean)
  active: boolean;

  @Column('varchar', { length: 255, nullable: true })
  @Field({ nullable: true })
  comment?: string;

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

  @ManyToOne(() => Course, (course) => course.reviews)
  @JoinColumn({ name: 'course_id' })
  @Field(() => Course, { nullable: true })
  course?: Course;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  @Field(() => User, { nullable: true })
  user?: User;
}
