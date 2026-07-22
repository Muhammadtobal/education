import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Level } from 'src/level/entities/level.entity';

@ObjectType()
@Entity()
export class EmployeeVendor {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('bigint')
  @Field()
  vendor_id: string;

  @Column('bigint')
  @Field()
  employee_id: string;

  @Column('bigint')
  @Field()
  level_id: string;

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

  @ManyToOne(() => Vendor, (vendor) => vendor.employee_vendors)
  @JoinColumn({ name: 'vendor_id' })
  @Field(() => Vendor, { nullable: true })
  vendor?: Vendor;

  @ManyToOne(() => Employee, (employee) => employee.employee_vendors)
  @JoinColumn({ name: 'employee_id' })
  @Field(() => Employee, { nullable: true })
  employee?: Employee;

  @ManyToOne(() => Level, (level) => level.employee_vendors)
  @JoinColumn({ name: 'level_id' })
  @Field(() => Level, { nullable: true })
  level?: Level;
}
