import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Level } from 'src/level/entities/level.entity';

@ObjectType()
@Entity()
export class VendorLevel {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('bigint')
  @Field()
  vendor_id: string;

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

  @ManyToOne(() => Vendor, (vendor) => vendor.vendor_levels)
  @JoinColumn({ name: 'vendor_id' })
  @Field(() => Vendor, { nullable: true })
  vendor?: Vendor;

  @ManyToOne(() => Level, (level) => level.vendor_levels)
  @JoinColumn({ name: 'level_id' })
  @Field(() => Level, { nullable: true })
  level?: Level;
}
