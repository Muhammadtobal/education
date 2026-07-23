import { Story } from 'src/story/entities/story.entity';
import { Course } from 'src/course/entities/course.entity';
import { EmployeeVendor } from 'src/employee_vendor/entities/employee_vendor.entity';
import { VendorLevel } from 'src/vendor-level/entities/vendor-level.entity';
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

  @Column({ type: 'bigint', nullable: true })
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

  @OneToMany(() => EmployeeVendor, (employee_vendor) => employee_vendor.level)
  employee_vendors: EmployeeVendor[];

  @ManyToOne(() => Level, (level) => level.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  @Field(() => Level, { nullable: true })
  parent?: Level;

  @OneToMany(() => Level, (level) => level.parent)
  @Field(() => [Level], { nullable: true })
  children?: Level[];

  @OneToMany(() => User, (user) => user.level)
  users: User[];

  @OneToMany(() => Course, (course) => course.level)
  courses: Course[];

  @OneToMany(() => VendorLevel, (vendor_level) => vendor_level.level)
  vendor_levels: VendorLevel[];

  @OneToMany(() => Story, (story) => story.level)
  stories: Story[];
}
