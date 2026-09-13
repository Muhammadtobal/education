import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import GraphQLJSON from 'graphql-type-json';

import { ObjectType, Field, Float, registerEnumType } from '@nestjs/graphql';

import { Content } from './content.entity';
import { VideoAssetStatus } from 'src/shared/enums/content_type.enum copy';

export enum VideoProvider {
  S3 = 'S3',
}

registerEnumType(VideoProvider, {
  name: 'VideoProvider',
});

@ObjectType()
@Entity('video_asset')
export class VideoAsset {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field()
  id: string;

  // =========================
  // Relation
  // =========================

  @Column('bigint')
  @Field()
  content_id: string;

  // =========================
  // Provider
  // =========================

  @Column({
    type: 'enum',
    enum: VideoProvider,
    default: VideoProvider.S3,
  })
  @Field(() => VideoProvider)
  provider: VideoProvider;

  @Column({ type: 'varchar', length: 1024 })
  @Field()
  provider_public_id: string;

  // =========================
  // Status
  // =========================

  @Column({
    type: 'enum',
    enum: VideoAssetStatus,
  })
  @Field(() => VideoAssetStatus)
  status: VideoAssetStatus;

  // =========================
  // URLs / Keys
  // =========================

  @Column({ type: 'varchar', length: 1024, nullable: true })
  @Field({ nullable: true })
  original_url?: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  @Field({ nullable: true })
  playback_url?: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  @Field({ nullable: true })
  thumbnail_url?: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  @Field({ nullable: true })
  original_key?: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  @Field({ nullable: true })
  hls_manifest_key?: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  @Field({ nullable: true })
  hls_manifest_url?: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  @Field({ nullable: true })
  thumbnail_key?: string;

  // =========================
  // Video information
  // =========================

  @Column({ type: 'float', nullable: true })
  @Field(() => Float, { nullable: true })
  duration_seconds?: number;

  @Column({ type: 'bigint', nullable: true })
  @Field({ nullable: true })
  size_bytes?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Field({ nullable: true })
  format?: string;

  @Column('simple-json', { nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: Record<string, any>;

  @Column('simple-json', { nullable: true })
  @Field(() => GraphQLJSON, { nullable: true })
  renditions?: Record<string, any>;

  // =========================
  // Processing
  // =========================

  @Column({ type: 'float', default: 0 })
  @Field(() => Float)
  processing_percentage: number;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  error_message?: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  processing_error?: string;

  // =========================
  // Flags
  // =========================

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  active: boolean;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  is_current: boolean;

  // =========================
  // Dates
  // =========================

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  @Field(() => Date, { nullable: true })
  processing_started_at?: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  @Field(() => Date, { nullable: true })
  processing_finished_at?: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Field(() => Date)
  updated_at: Date;

  // =========================
  // Relation
  // =========================

  @ManyToOne(() => Content, (content) => content.video_assets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'content_id' })
  @Field(() => Content, { nullable: true })
  content: Content;
}
