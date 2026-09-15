import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

import GraphQLJSON from 'graphql-type-json';

import { ObjectType, Field, Float, registerEnumType } from '@nestjs/graphql';
import {
  MediaAssetStatus,
  MediaAssetType,
  MediaProvider,
} from 'src/shared/enums/media_asset.enum';
import { Content } from './content.entity';

@ObjectType()
@Entity()
export class MediaAsset {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  @Column('bigint')
  @Field()
  content_id: string;

  @Column({
    type: 'enum',
    enum: MediaAssetType,
  })
  @Field(() => MediaAssetType)
  type: MediaAssetType;

  @Column({
    type: 'enum',
    enum: MediaProvider,
  })
  @Field(() => MediaProvider)
  provider: MediaProvider;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  @Field({ nullable: true })
  provider_public_id?: string;

  @Column({
    type: 'enum',
    enum: MediaAssetStatus,
    default: MediaAssetStatus.PENDING_UPLOAD,
  })
  @Field(() => MediaAssetStatus)
  status: MediaAssetStatus;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  @Field({ nullable: true })
  original_key?: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  @Field({ nullable: true })
  original_url?: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  @Field({ nullable: true })
  thumbnail_key?: string;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  @Field({ nullable: true })
  file_name?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  @Field({ nullable: true })
  mime_type?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  @Field({ nullable: true })
  extension?: string;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  @Field({ nullable: true })
  size_bytes?: string;

  // =========================
  // Media information
  // =========================

  @Column({
    type: 'float',
    nullable: true,
  })
  @Field(() => Float, { nullable: true })
  duration_seconds?: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  @Field(() => Float, { nullable: true })
  width?: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  @Field(() => Float, { nullable: true })
  height?: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  @Field(() => Boolean)
  is_pdf: boolean;

  @Column('simple-json', {
    nullable: true,
  })
  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: Record<string, any>;

  @Column({
    type: 'text',
    nullable: true,
  })
  @Field({ nullable: true })
  error_message?: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  @Field(() => Boolean)
  active: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  @Field(() => Date, { nullable: true })
  uploaded_at?: Date;

  @CreateDateColumn({
    type: 'timestamp',
  })
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  @Field(() => Date)
  updated_at: Date;

  @ManyToOne(() => Content, (content) => content.media_assets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'content_id' })
  @Field(() => Content, { nullable: true })
  content: Content;
}
