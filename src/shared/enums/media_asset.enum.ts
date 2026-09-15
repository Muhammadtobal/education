import { registerEnumType } from '@nestjs/graphql';

export enum MediaAssetType {
  FILE = 'FILE',
  AUDIO = 'AUDIO',
}

export enum MediaProvider {
  S3 = 'S3',
}

export enum MediaAssetStatus {
  PENDING_UPLOAD = 'PENDING_UPLOAD',
  READY = 'READY',
  FAILED = 'FAILED',
}

registerEnumType(MediaAssetType, {
  name: 'MediaAssetType',
});

registerEnumType(MediaProvider, {
  name: 'MediaProvider',
});

registerEnumType(MediaAssetStatus, {
  name: 'MediaAssetStatus',
});
