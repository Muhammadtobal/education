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

import { Course } from 'src/course/entities/course.entity';
import { ContentType } from 'src/shared/enums/content_type.enum';

@ObjectType()
@Entity()
export class Content {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('bigint')
  @Field()
  course_id: string;

  @Column({
    type: 'enum',
    enum: ContentType,
  })
  @Field(() => ContentType)
  content_type: ContentType;

  @Column('simple-json', { nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  content_info?: Record<string, any>;

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

  @ManyToOne(() => Course, (course) => course.contents)
  @JoinColumn({ name: 'course_id' })
  @Field(() => Course, { nullable: true })
  course?: Course;
}
