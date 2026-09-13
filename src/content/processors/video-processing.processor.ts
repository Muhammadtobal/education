import { Processor, WorkerHost } from '@nestjs/bullmq';

import { Job } from 'bullmq';

import { ContentService } from '../content.service';

@Processor('video-processing')
export class VideoProcessingProcessor extends WorkerHost {
  constructor(private readonly contentService: ContentService) {
    super();
  }

  async process(job: Job<{ videoAssetId: string }>) {
    const { videoAssetId } = job.data;

    console.log(`Starting video processing: ${videoAssetId}`);

    await this.contentService.processVideoAsset(videoAssetId);

    console.log(`Finished video processing: ${videoAssetId}`);
  }
}
