import { Answer } from 'src/answer/entities/answer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

import { Exam } from 'src/exam/entities/exam.entity';
import { Direction } from 'src/shared/enums/direction.enum';
import { AnswerUser } from 'src/answer/entities/answer-user.entity';

@ObjectType()
@Entity()
export class Question {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  question_text: string;

  @Column({ type: 'text' })
  @Field()
  hint_text: string;

  @Column('bigint')
  @Field()
  exam_id: string;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  parent_id?: string;

  @Column({
    type: 'enum',
    enum: Direction,
  })
  @Field(() => Direction)
  direction: Direction;

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

  @ManyToOne(() => Exam, (exam) => exam.questions)
  @JoinColumn({ name: 'exam_id' })
  @Field(() => Exam, { nullable: true })
  exam?: Exam;

  @ManyToOne(() => Question, (question) => question.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  @Field(() => Question, { nullable: true })
  parent?: Question;

  @OneToMany(() => Question, (question) => question.parent)
  @Field(() => [Question], { nullable: true })
  children?: Question[];

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @OneToMany(() => AnswerUser, (answer_user) => answer_user.question)
  answer_users: AnswerUser[];
}
