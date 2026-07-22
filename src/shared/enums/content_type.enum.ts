import { registerEnumType } from '@nestjs/graphql';

export enum ContentType {
  FILE = 'file',
  VIDEO = 'video',
  AUDIO = 'audio',
}

registerEnumType(ContentType, {
  name: 'ContentType',
  description: 'Content type (file, video, or audio)',
});
