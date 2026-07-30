import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

import { Level } from 'src/level/entities/level.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@ObjectType()
@Entity()
export class Story {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('varchar', { length: 255, nullable: true })
  @Field({ nullable: true })
  url?: string;

  @Column('varchar', { length: 255, nullable: true })
  @Field({ nullable: true })
  title?: string;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  level_id?: string;

  @Column('bigint', { nullable: true })
  @Field({ nullable: true })
  vendor_id?: string;

  @Column('boolean', { default: true })
  @Field(() => Boolean)
  active: boolean;

  @Column('varchar', { length: 255, nullable: true })
  @Field({ nullable: true })
  comment?: string;

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

  @ManyToOne(() => Level, (level) => level.stories)
  @JoinColumn({ name: 'level_id' })
  @Field(() => Level, { nullable: true })
  level?: Level;

  @ManyToOne(() => Vendor, (vendor) => vendor.stories)
  @JoinColumn({ name: 'vendor_id' })
  @Field(() => Vendor, { nullable: true })
  vendor?: Vendor;
}
