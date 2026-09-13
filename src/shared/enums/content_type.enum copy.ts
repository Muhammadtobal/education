import { registerEnumType } from '@nestjs/graphql';

export enum VideoAssetStatus {
  PENDING_UPLOAD = 'pending_upload',
  UPLOADED = 'upload',
  PROCESSING = 'processing',
  READY = 'ready',
  FAILED = 'failed',
}

registerEnumType(VideoAssetStatus, {
  name: 'VideoAssetStatus',
  description: 'VideoAssetStatus type (failed, processing, or upload)',
});
