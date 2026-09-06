import { Question } from 'src/question/entities/question.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

import { Course } from 'src/course/entities/course.entity';
import { Direction } from 'src/shared/enums/direction.enum';
import { ExamUser } from './exam-user.entity';
import { AnswerUser } from 'src/answer/entities/answer-user.entity';
import { Content } from 'src/content/entities/content.entity';

@ObjectType()
@Entity()
export class Exam {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  name: string;

  @Column('bigint')
  @Field()
  course_id: string;

  @Column({
    type: 'enum',
    enum: Direction,
  })
  @Field(() => Direction)
  direction: Direction;

  @Column('int', { default: 60 })
  @Field(() => Int)
  exam_duration: number;

  @Column({ type: 'timestamp' })
  @Field(() => Date)
  exam_date: Date;

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

  @ManyToOne(() => Course, (course) => course.exams)
  @JoinColumn({ name: 'course_id' })
  @Field(() => Course, { nullable: true })
  course?: Course;

  @OneToMany(() => Question, (question) => question.exam)
  questions: Question[];

  @OneToMany(() => ExamUser, (exam_user) => exam_user.exam)
  exam_users: ExamUser[];

  @OneToMany(() => AnswerUser, (answer_user) => answer_user.exam)
  answer_users: AnswerUser[];

  @OneToMany(() => Content, (content) => content.exam)
  contents: Content[];
}
