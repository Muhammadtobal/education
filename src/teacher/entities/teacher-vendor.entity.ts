import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

import { Teacher } from 'src/teacher/entities/teacher.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@ObjectType()
@Entity()
export class TeacherVendor {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column({ type: 'bigint' })
  @Field()
  teacher_id: string;

  @Column({ type: 'bigint' })
  @Field()
  vendor_id: string;

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

  @ManyToOne(() => Teacher, (teacher) => teacher.teacher_vendors, {})
  @JoinColumn({ name: 'teacher_id' })
  @Field(() => Teacher)
  teacher: Teacher;

  @ManyToOne(() => Vendor, (vendor) => vendor.teacher_vendors, {})
  @JoinColumn({ name: 'vendor_id' })
  @Field(() => Vendor)
  vendor: Vendor;
}
