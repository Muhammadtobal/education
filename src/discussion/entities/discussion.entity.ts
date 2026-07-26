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
import { DiscussionStatus } from 'src/shared/enums/discussion_status.enum';
import { Course } from 'src/course/entities/course.entity';
import { Employee } from 'src/employee/entities/employee.entity';

@ObjectType()
@Entity()
export class Discussion {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  teacher_id?: string;

  @Column('bigint')
  @Field()
  course_id: string;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  user_id?: string;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  employee_id?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  title?: string;

  @Column({ type: 'text' })
  @Field()
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  url?: string;

  @Column({
    type: 'enum',
    enum: DiscussionStatus,
    default: DiscussionStatus.OPEN,
  })
  status: DiscussionStatus;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  parent_id?: string;

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

  @ManyToOne(() => Employee, (employee) => employee.discussions)
  @JoinColumn({ name: 'employee_id' })
  @Field(() => Employee, { nullable: true })
  employee?: Employee;

  @ManyToOne(() => User, (user) => user.discussions)
  @JoinColumn({ name: 'user_id' })
  @Field(() => User, { nullable: true })
  user?: User;

  @ManyToOne(() => Course, (course) => course.discussions)
  @JoinColumn({ name: 'course_id' })
  @Field(() => Course, { nullable: true })
  course?: Course;

  @ManyToOne(() => Discussion, (discussion) => discussion.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  @Field(() => Discussion, { nullable: true })
  parent?: Discussion;

  @OneToMany(() => Discussion, (discussion) => discussion.parent)
  @Field(() => [Discussion], { nullable: true })
  children?: Discussion[];
}
