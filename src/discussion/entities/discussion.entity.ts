import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

import { Teacher } from 'src/teacher/entities/teacher.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
@Entity()
export class Discussion {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('bigint')
  @Field()
  teacher_id: string;

  @Column('bigint')
  @Field()
  user_id: string;

  @Column({ type: 'text', nullable: true })
  @Field()
  message: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  url?: string;

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

  @ManyToOne(() => Teacher, (teacher) => teacher.discussions)
  @JoinColumn({ name: 'teacher_id' })
  @Field(() => Teacher, { nullable: true })
  teacher?: Teacher;

  @ManyToOne(() => User, (user) => user.discussions)
  @JoinColumn({ name: 'user_id' })
  @Field(() => User, { nullable: true })
  user?: User;
}
