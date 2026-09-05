import { Story } from 'src/story/entities/story.entity';
import { Course } from 'src/course/entities/course.entity';
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

@ObjectType()
@Entity()
export class Level {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  name: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  title: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  icon: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  color: string;

  @Column({ type: 'bigint', nullable: true })
  @Field({ nullable: true })
  parent_id?: string;

  @Column('boolean', { default: true })
  @Field(() => Boolean)
  active: boolean;

  @Column('boolean', { nullable: true })
  @Field(() => Boolean)
  next_level?: boolean;

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

  @ManyToOne(() => Level, (level) => level.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: Level;

  @OneToMany(() => Level, (level) => level.parent)
  children?: Level[];

  @OneToMany(() => User, (user) => user.level)
  users: User[];

  @OneToMany(() => Course, (course) => course.level)
  courses: Course[];

  @OneToMany(() => Story, (story) => story.level)
  stories: Story[];
}
