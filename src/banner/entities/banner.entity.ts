import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";

import { ObjectType, Field, Int, Float, ID } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class Banner {
  @PrimaryGeneratedColumn({ type: "bigint" })
  @Field()
  id: string;

  @Column({ type: "varchar", length: 255 })
  @Field()
  image_url: string;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  title?: string;

  @Column({ type: "text", nullable: true })
  @Field({ nullable: true })
  subtitle?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  @Field({ nullable: true })
  action_url?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  @Field({ nullable: true })
  action_type?: string;

  @Column({ type: "int", default: 0 })
  @Field(() => Int)
  sort_order: number;

  @Column({ type: "boolean", default: true })
  @Field(() => Boolean)
  active: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  @Field(() => Date)
  start_date: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  @Field(() => Date)
  end_date: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  @Field(() => Date)
  created_at: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  @Field(() => Date)
  updated_at: Date;
}
