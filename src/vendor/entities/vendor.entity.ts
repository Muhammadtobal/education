import { EmployeeVendor } from 'src/employee_vendor/entities/employee_vendor.entity';
import { VendorLevel } from 'src/vendor-level/entities/vendor-level.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
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
import { Plan } from 'src/plan/entities/plan.entity';
import { Course } from 'src/course/entities/course.entity';

@ObjectType()
@Entity()
export class Vendor {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  icon: string;

  @Column('varchar', { length: 255 })
  @Field()
  phone: string;

  @Column('varchar', { length: 2, default: 'ar' })
  @Field()
  lang: string;

  @Column('varchar', { length: 255, nullable: true })
  @Field({ nullable: true })
  img_url?: string;

  @Column('varchar', { length: 255, nullable: true })
  fcm_token?: string;

  @Column('varchar', { length: 255, nullable: true })
  refresh_token?: string;

  @Column('simple-json', { nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  device_info?: Record<string, any>;

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

  @OneToMany(() => VendorLevel, (vendor_level) => vendor_level.vendor)
  vendor_levels: VendorLevel[];

  @OneToMany(() => EmployeeVendor, (employee_vendor) => employee_vendor.vendor)
  employee_vendors: EmployeeVendor[];

  @OneToMany(() => Teacher, (teacher) => teacher.vendor)
  teachers: Teacher[];

  @OneToMany(() => Plan, (plan) => plan.vendor)
  plans: Plan[];

  @OneToMany(() => Course, (course) => course.vendor)
  courses: Course[];
}
