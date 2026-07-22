import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

import { Question } from 'src/question/entities/question.entity';
import { Direction } from 'src/shared/enums/direction.enum';
import { AnswerUser } from './answer-user.entity';

@ObjectType()
@Entity()
export class Answer {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  answer_text: string;

  @Column({ type: 'text' })
  @Field()
  hint_text: string;

  @Column('bigint')
  @Field()
  question_id: string;

  @Column({
    type: 'enum',
    enum: Direction,
  })
  @Field(() => Direction)
  direction: Direction;

  @Column('boolean')
  @Field(() => Boolean)
  is_true: boolean;

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

  @ManyToOne(() => Question, (question) => question.answers)
  @JoinColumn({ name: 'question_id' })
  @Field(() => Question, { nullable: true })
  question?: Question;

  @OneToMany(() => AnswerUser, (answer_user) => answer_user.answer)
  answer_users: AnswerUser[];
}
