import { Exam } from 'src/exam/entities/exam.entity';
import { User } from 'src/user/entities/user.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
@Entity('exam_user')
export class ExamUser {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('bigint')
  @Field()
  exam_id: string;

  @Column('bigint')
  @Field()
  user_id: string;

  @Column({
    type: 'float',
    nullable: true,
  })
  @Field(() => Float, { nullable: true })
  mark?: number;

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

  @ManyToOne(() => Exam, (exam) => exam.exam_users, {})
  @JoinColumn({ name: 'exam_id' })
  @Field(() => Exam)
  exam: Exam;

  @ManyToOne(() => User, (user) => user.exam_users, {})
  @JoinColumn({ name: 'user_id' })
  @Field(() => User)
  user: User;
}
