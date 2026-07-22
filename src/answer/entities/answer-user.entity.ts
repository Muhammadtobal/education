import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { User } from 'src/user/entities/user.entity';
import { Question } from 'src/question/entities/question.entity';
import { Answer } from 'src/answer/entities/answer.entity';
import { Exam } from 'src/exam/entities/exam.entity';

@ObjectType()
@Entity()
export class AnswerUser {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('bigint')
  @Field()
  user_id: string;

  @Column('bigint')
  @Field()
  question_id: string;

  @Column('bigint')
  @Field()
  exam_id: string;

  @Column('bigint')
  @Field()
  answer_id: string;

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

  @ManyToOne(() => User, (user) => user.answer_users, {})
  @JoinColumn({ name: 'user_id' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Exam, (exam) => exam.answer_users, {})
  @JoinColumn({ name: 'exam_id' })
  @Field(() => Exam)
  exam: Exam;

  @ManyToOne(() => Question, (question) => question.answer_users, {})
  @JoinColumn({ name: 'question_id' })
  @Field(() => Question)
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.answer_users, {})
  @JoinColumn({ name: 'answer_id' })
  @Field(() => Answer)
  answer: Answer;
}
