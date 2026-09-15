import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { Content } from './entities/content.entity';
import { FindAllContentInput } from './dto/find-all-content.input';

import {
  generateQueryConditions,
  generateQuerySorts,
  customPaginate,
} from 'src/shared/helpers';
import { PaginationMetadata } from 'src/shared/types/pagination-metadata';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { AppService } from 'src/app.service';
import { VideoAsset, VideoProvider } from './entities/video_asset.entity';
import { VideoAssetStatus } from 'src/shared/enums/content_type.enum copy';
import { CreateVideoUploadInput } from './dto/create-video-upload.input';
import { CompleteVideoUploadInput } from './dto/complete-video-upload.input';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { existsSync, mkdirSync, rmSync } from 'fs';

import { extname, join } from 'path';

import { execFile } from 'child_process';

import { promisify } from 'util';
import { VideoStreamService } from './processors/video-stream.service';
import { CreateMediaAssetUploadInput } from './dto/create-media-asset.input';
import {
  MediaAssetStatus,
  MediaProvider,
} from 'src/shared/enums/media_asset.enum';
import { MediaAsset } from './entities/media_asset.entity';
import {
  FailMediaAssetUploadInput,
  MediaAssetActionInput,
} from './dto/fail-media-asset-upload.input';
import { CompleteMediaAssetUploadInput } from './dto/complete-media-asset-upload.input';
const ffmpegPath = join(process.cwd(), 'bin', 'ffmpeg');
const execFileAsync = promisify(execFile);
@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService,

    @InjectRepository(VideoAsset)
    private readonly videoAssetRepository: Repository<VideoAsset>,

    @InjectRepository(MediaAsset)
    private readonly mediaAssetRepository: Repository<MediaAsset>,
    @Inject(forwardRef(() => AppService))
    private readonly appService: AppService,
    @InjectQueue('video-processing')
    private readonly videoProcessingQueue: Queue,

    private readonly videoStreamService: VideoStreamService,
  ) {}
  public async create(createContentInput: CreateContentInput) {
    const content = this.contentRepository.create(createContentInput);

    return this.contentRepository.save(content);
  }

  public async findAll(filter: FindAllContentInput) {
    const query = this.contentRepository
      .createQueryBuilder('content')
      .leftJoinAndSelect('content.course', 'course')
      .leftJoinAndSelect('content.video_assets', 'video_assets')
      .leftJoinAndSelect('content.exam', 'exam')
      .where('true');

    if (filter.parent_content === true) {
      query.andWhere('content.parent_id IS NULL');
    }

    const { parent_content, ...contentFilter } = filter;

    generateQuerySorts<Content>(query, contentFilter, Content, 'content');

    generateQueryConditions<Content>(query, contentFilter, 'content');

    const result = await customPaginate<Content, PaginationMetadata>(query, {
      limit: filter.pagination.limit,
      page: filter.pagination.page,
    });

    return result;
  }

  public findOne(
    contentOptions: FindOptionsWhere<Content>,
    options?: {
      selected?: FindOptionsSelect<Content>;
      relations?: FindOptionsRelations<Content>;
    },
  ) {
    return this.contentRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: contentOptions,
    });
  }

  public findOneVideoAsset(
    videoAssetOptions: FindOptionsWhere<VideoAsset>,
    options?: {
      selected?: FindOptionsSelect<VideoAsset>;
      relations?: FindOptionsRelations<VideoAsset>;
    },
  ) {
    return this.videoAssetRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: videoAssetOptions,
    });
  }

  public findOneMediaAsset(
    mediaAssetOptions: FindOptionsWhere<MediaAsset>,
    options?: {
      selected?: FindOptionsSelect<MediaAsset>;
      relations?: FindOptionsRelations<MediaAsset>;
    },
  ) {
    return this.mediaAssetRepository.findOne({
      select: options?.selected,
      relations: options?.relations,
      where: mediaAssetOptions,
    });
  }

  public async update(updateContentInput: UpdateContentInput) {
    await this.contentRepository.update(
      { id: updateContentInput.id },
      updateContentInput,
    );
    return this.findOne({ id: updateContentInput.id });
  }

  public remove(id: string) {
    this.contentRepository.delete(id);
  }

  async getPlaybackUrl(userId: string, contentId: string) {
    // 1. Check subscription/access
    const access = await this.subscriptionService.checkContentAccess(
      userId,
      contentId,
    );

    console.log('ACCESS RESULT:', access);

    // 2. Get current ready video
    const asset = await this.videoAssetRepository.findOne({
      where: {
        content_id: contentId,
        status: VideoAssetStatus.READY,
        active: true,
        is_current: true,
      },
      order: {
        created_at: 'DESC',
      },
    });

    if (!asset) {
      throw new HttpException('Video is not ready', HttpStatus.NOT_FOUND);
    }

    if (!asset.hls_manifest_key) {
      throw new HttpException('HLS manifest not found', HttpStatus.NOT_FOUND);
    }

    // Example:
    // videos/33/hls/3/master.m3u8

    const hlsKey = asset.hls_manifest_key;

    const pathPrefix = '/' + hlsKey.substring(0, hlsKey.lastIndexOf('/') + 1);
    // 3. Generate signed playback token
    const token = this.videoStreamService.generateToken({
      userId,
      contentId,
      assetId: asset.id,
      pathPrefix,
    });

    // 4. Build playback URL
    const playbackUrl =
      `${process.env.PUBLIC_API_URL}/video-stream/${hlsKey}` +
      `?token=${encodeURIComponent(token)}`;

    return {
      video_asset_id: asset.id,
      playback_url: playbackUrl,
      expires_in: this.videoStreamService.getTokenTtl(),
    };
  }

  async getHlsSegment(userId: string, contentId: string, segment: string) {
    // التأكد من الصلاحية
    await this.subscriptionService.checkContentAccess(userId, contentId);

    const content = await this.findOne({
      id: contentId,
    });

    if (!content) {
      throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
    }

    if (!content.hls_key) {
      throw new HttpException('Video HLS is not ready', HttpStatus.NOT_FOUND);
    }

    // videos/2/hls/master.m3u8
    // نريد:
    // videos/2/hls/segment_000.ts

    const hlsPrefix = content.hls_key.substring(
      0,
      content.hls_key.lastIndexOf('/'),
    );

    const segmentKey = `${hlsPrefix}/${segment}`;

    return this.appService.getFileStreamFromB2(segmentKey);
  }

  async getHlsMaster(userId: string, contentId: string) {
    // 1. التأكد أن المستخدم يملك صلاحية مشاهدة الفيديو
    await this.subscriptionService.checkContentAccess(userId, contentId);

    // 2. جلب المحتوى
    const content = await this.findOne({
      id: contentId,
    });

    if (!content) {
      throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
    }

    // 3. التأكد أن HLS موجود
    if (!content.hls_key) {
      throw new HttpException('Video HLS is not ready', HttpStatus.NOT_FOUND);
    }

    // 4. جلب master.m3u8 من B2
    const playlist = await this.appService.getFileFromB2(content.hls_key);

    return playlist;
  }

  async createVideoUpload(input: CreateVideoUploadInput) {
    const content = await this.contentRepository.findOne({
      where: {
        id: input.content_id,
      },
    });

    if (!content) {
      throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
    }

    const timestamp = Date.now();

    const objectKey =
      `videos/${input.content_id}/original/` +
      `${timestamp}-${input.file_name}`;

    const providerPublicId = objectKey;

    const asset = new VideoAsset();

    asset.content_id = input.content_id;
    asset.status = VideoAssetStatus.PENDING_UPLOAD;
    asset.provider = VideoProvider.S3;
    asset.provider_public_id = providerPublicId;
    asset.original_key = objectKey;

    asset.size_bytes = input.size_bytes ? String(input.size_bytes) : undefined;

    asset.active = true;
    asset.is_current = true;
    asset.processing_percentage = 0;

    const savedAsset = await this.videoAssetRepository.save(asset);
    const { uploadUrl, uploadHeaders } =
      await this.appService.generatePresignedUploadUrl(
        objectKey,
        input.mime_type,
        900,
      );

    return {
      video_asset_id: savedAsset.id,
      provider: 'S3',
      provider_public_id: providerPublicId,

      upload_method: 'PUT',

      upload_url: uploadUrl,

      upload_headers: uploadHeaders,

      object_key: objectKey,

      public_id: providerPublicId,

      video_asset: savedAsset,
    };
  }

  async completeVideoUpload(input: CompleteVideoUploadInput) {
    const asset = await this.videoAssetRepository.findOne({
      where: {
        id: input.video_asset_id,
      },
      relations: ['content'],
    });

    if (!asset) {
      throw new HttpException('Video asset not found', HttpStatus.NOT_FOUND);
    }

    if (asset.status !== VideoAssetStatus.PENDING_UPLOAD) {
      throw new HttpException(
        `Video asset cannot be completed from status ${asset.status}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (asset.provider !== VideoProvider.S3) {
      throw new HttpException(
        `Unsupported video provider: ${asset.provider}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (asset.provider_public_id !== input.provider_public_id) {
      throw new HttpException(
        'Provider public ID does not match video asset',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!asset.original_key) {
      throw new HttpException(
        'Video asset does not have an original object key',
        HttpStatus.BAD_REQUEST,
      );
    }

    let headObject;
    const objects = await this.appService.listObjects(
      `videos/${asset.content_id}/original/`,
    );

    console.log('========== B2 LIST OBJECTS ==========');

    console.log(
      objects.Contents?.map((object) => ({
        key: object.Key,
        size: object.Size,
        etag: object.ETag,
      })),
    );
    console.log('========== COMPLETE VIDEO DEBUG ==========');

    console.log('asset.id:', asset.id);
    console.log('asset.status:', asset.status);
    console.log('asset.provider:', asset.provider);
    console.log('asset.provider_public_id:', asset.provider_public_id);
    console.log('asset.original_key:', asset.original_key);

    console.log('B2 bucket:', process.env.B2_BUCKET_NAME);
    console.log('B2 endpoint:', process.env.B2_ENDPOINT);

    try {
      headObject = await this.appService.headObject(asset.original_key!);

      console.log('========== B2 HEAD SUCCESS ==========');
      console.log(headObject);
    } catch (error) {
      console.error('========== B2 HEAD ERROR ==========');
      console.error(error);

      throw new HttpException(
        'Uploaded video was not found in storage',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!headObject.ContentLength) {
      throw new HttpException(
        'Uploaded video is empty',
        HttpStatus.BAD_REQUEST,
      );
    }

    asset.status = VideoAssetStatus.UPLOADED;

    asset.size_bytes = String(headObject.ContentLength);

    if (headObject.ContentType) {
      asset.format =
        input.format ?? headObject.ContentType.split('/')[1] ?? undefined;
    } else if (input.format) {
      asset.format = input.format;
    }

    asset.metadata = {
      ...(asset.metadata ?? {}),
      ...(input.metadata ?? {}),
      storage: {
        provider: 'backblaze-b2',
        bucket: process.env.B2_BUCKET_NAME,
        etag: headObject.ETag,
        version_id: headObject.VersionId,
        content_type: headObject.ContentType,
      },
    };

    if (input.duration_seconds !== undefined) {
      asset.duration_seconds = input.duration_seconds;
    }

    asset.processing_percentage = 0;
    asset.error_message = undefined;
    asset.processing_error = undefined;

    const savedAsset = await this.videoAssetRepository.save(asset);

    await this.videoProcessingQueue.add(
      'process-video',
      {
        videoAssetId: savedAsset.id,
      },
      {
        attempts: 3,

        backoff: {
          type: 'exponential',
          delay: 5000,
        },

        removeOnComplete: 100,
        removeOnFail: 1000,
      },
    );

    return savedAsset;
  }

  async processVideoAsset(videoAssetId: string) {
    const asset = await this.videoAssetRepository.findOne({
      where: {
        id: videoAssetId,
      },
      relations: ['content'],
    });

    if (!asset) {
      throw new Error(`Video asset ${videoAssetId} not found`);
    }

    if (asset.status !== VideoAssetStatus.UPLOADED) {
      console.log(
        `Skipping asset ${videoAssetId}. Current status: ${asset.status}`,
      );

      return;
    }

    if (!asset.original_key) {
      throw new Error(`Video asset ${videoAssetId} has no original_key`);
    }

    const workDir = join('/tmp', 'video-processing', String(asset.id));

    const inputPath = join(workDir, 'source', 'original');

    const hlsDir = join(workDir, 'hls');

    const thumbnailDir = join(workDir, 'thumbnail');

    const inputFile = join(inputPath, 'source.mp4');

    try {
      /*
       * -----------------------------------------
       * 1. Mark PROCESSING
       * -----------------------------------------
       */

      asset.status = VideoAssetStatus.PROCESSING;

      asset.processing_percentage = 5;

      asset.processing_started_at = new Date();

      asset.processing_error = undefined;
      asset.error_message = undefined;

      await this.videoAssetRepository.save(asset);

      /*
       * -----------------------------------------
       * 2. Prepare directories
       * -----------------------------------------
       */

      mkdirSync(inputPath, {
        recursive: true,
      });

      mkdirSync(hlsDir, {
        recursive: true,
      });

      mkdirSync(thumbnailDir, {
        recursive: true,
      });

      /*
       * -----------------------------------------
       * 3. Download original from B2
       * -----------------------------------------
       */

      console.log(`Downloading ${asset.original_key}`);

      await this.appService.downloadFromB2(asset.original_key, inputFile);

      asset.processing_percentage = 20;

      await this.videoAssetRepository.save(asset);

      /*
       * -----------------------------------------
       * 4. Convert to HLS
       * -----------------------------------------
       */

      console.log(`Converting video ${asset.id} to HLS`);

      await this.appService.convertToHls(inputFile, hlsDir);

      asset.processing_percentage = 65;

      await this.videoAssetRepository.save(asset);

      /*
       * -----------------------------------------
       * 5. Generate thumbnail
       * -----------------------------------------
       */

      console.log(`Generating thumbnail for ${asset.id}`);

      const thumbnailPath = join(thumbnailDir, 'thumbnail.jpg');

      await this.generateThumbnail(inputFile, thumbnailPath);

      asset.processing_percentage = 75;

      await this.videoAssetRepository.save(asset);

      /*
       * -----------------------------------------
       * 6. Upload HLS to B2
       * -----------------------------------------
       */

      const hlsPrefix = `videos/${asset.content_id}/hls/${asset.id}`;

      console.log(`Uploading HLS to ${hlsPrefix}`);

      await this.appService.uploadHlsDirectory(hlsDir, hlsPrefix);

      /*
       * -----------------------------------------
       * 7. Upload thumbnail to B2
       * -----------------------------------------
       */

      const thumbnailKey = `videos/${asset.content_id}/thumbnail/${asset.id}.jpg`;

      await this.appService.uploadFileToB2(
        thumbnailPath,
        thumbnailKey,
        'image/jpeg',
      );

      asset.processing_percentage = 90;

      await this.videoAssetRepository.save(asset);

      /*
       * -----------------------------------------
       * 8. Save final keys
       * -----------------------------------------
       */

      const hlsManifestKey = `${hlsPrefix}/master.m3u8`;

      asset.hls_manifest_key = hlsManifestKey;

      asset.thumbnail_key = thumbnailKey;

      asset.status = VideoAssetStatus.READY;

      asset.processing_percentage = 100;

      asset.processing_finished_at = new Date();

      asset.processing_error = undefined;

      await this.videoAssetRepository.save(asset);

      console.log(`Video ${asset.id} is READY`);
    } catch (error) {
      console.error(`Video processing failed for ${asset.id}`, error);

      asset.status = VideoAssetStatus.FAILED;

      asset.processing_error =
        error instanceof Error ? error.message : String(error);

      asset.error_message = 'Video processing failed';

      await this.videoAssetRepository.save(asset);

      throw error;
    } finally {
      /*
       * -----------------------------------------
       * 9. Cleanup local files
       * -----------------------------------------
       */

      try {
        if (existsSync(workDir)) {
          rmSync(workDir, {
            recursive: true,
            force: true,
          });
        }
      } catch (cleanupError) {
        console.error('Video processing cleanup failed:', cleanupError);
      }
    }
  }

  async generateThumbnail(inputPath: string, outputPath: string) {
    if (!ffmpegPath) {
      throw new Error('FFmpeg binary not found');
    }

    await execFileAsync(ffmpegPath, [
      '-y',
      '-ss',
      '00:00:01',
      '-i',
      inputPath,
      '-frames:v',
      '1',
      '-q:v',
      '2',
      outputPath,
    ]);

    return outputPath;
  }

  async createMediaAssetUpload(input: CreateMediaAssetUploadInput) {
    const content = await this.contentRepository.findOne({
      where: {
        id: input.content_id,
      },
    });

    if (!content) {
      throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
    }

    const extension = extname(input.file_name!).replace('.', '').toLowerCase();

    const asset = this.mediaAssetRepository.create({
      content_id: input.content_id,

      type: input.type,

      provider: MediaProvider.S3,

      status: MediaAssetStatus.PENDING_UPLOAD,

      file_name: input.file_name,

      mime_type: input.mime_type,

      extension,

      size_bytes: input.size_bytes ? String(input.size_bytes) : undefined,

      is_pdf: input.mime_type === 'application/pdf' || extension === 'pdf',

      active: true,
    });

    const savedAsset = await this.mediaAssetRepository.save(asset);

    const objectKey =
      `media/${input.content_id}/` +
      `${input.type.toLowerCase()}/` +
      `${savedAsset.id}/` +
      `${input.file_name}`;

    savedAsset.original_key = objectKey;
    savedAsset.provider_public_id = objectKey;

    await this.mediaAssetRepository.save(savedAsset);
    console.log('SAVED MEDIA ASSET:', {
      id: savedAsset.id,
      original_key: savedAsset.original_key,
      provider_public_id: savedAsset.provider_public_id,
    });
    const { uploadUrl, uploadHeaders } =
      await this.appService.generatePresignedUploadUrl(
        objectKey,
        input.mime_type,
        900,
      );

    return {
      media_asset_id: savedAsset.id,

      provider: MediaProvider.S3,

      provider_public_id: objectKey,

      upload_method: 'PUT',

      upload_url: uploadUrl,

      upload_headers: uploadHeaders,

      object_key: objectKey,

      public_id: objectKey,

      media_asset: savedAsset,
    };
  }

  async completeMediaAssetUpload(input: CompleteMediaAssetUploadInput) {
    const asset = await this.findOneMediaAsset({
      id: input.media_asset_id,
    });

    console.log('COMPLETE MEDIA ASSET:', {
      id: asset?.id,
      original_key: asset?.original_key,
      provider_public_id: asset?.provider_public_id,
    });
    if (!asset) {
      throw new HttpException('Media asset not found', HttpStatus.NOT_FOUND);
    }

    if (asset.status !== MediaAssetStatus.PENDING_UPLOAD) {
      throw new HttpException(
        `Media asset is already ${asset.status}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!asset.original_key) {
      throw new HttpException(
        'Original key is missing',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.appService.headObject(asset.original_key);

      asset.status = MediaAssetStatus.READY;

      asset.size_bytes = result.ContentLength
        ? String(result.ContentLength)
        : asset.size_bytes;

      asset.mime_type = result.ContentType || asset.mime_type;

      asset.uploaded_at = new Date();

      if (input.duration_seconds !== undefined) {
        asset.duration_seconds = input.duration_seconds;
      }

      if (input.width !== undefined) {
        asset.width = input.width;
      }

      if (input.height !== undefined) {
        asset.height = input.height;
      }

      if (input.metadata !== undefined) {
        asset.metadata = input.metadata;
      }

      asset.error_message = undefined;

      return await this.mediaAssetRepository.save(asset);
    } catch (error) {
      asset.status = MediaAssetStatus.FAILED;

      asset.error_message =
        error instanceof Error ? error.message : String(error);

      await this.mediaAssetRepository.save(asset);

      throw error;
    }
  }

  async failMediaAssetUpload(input: FailMediaAssetUploadInput) {
    const asset = await this.findOneMediaAsset({
      id: input.media_asset_id,
    });

    if (!asset) {
      throw new NotFoundException('Media asset not found');
    }

    asset.status = MediaAssetStatus.FAILED;

    asset.error_message = input.error_message || 'Media upload failed';

    return this.mediaAssetRepository.save(asset);
  }

  async cancelMediaAssetUpload(input: MediaAssetActionInput) {
    const asset = await this.findOneMediaAsset({
      id: input.media_asset_id,
    });

    if (!asset) {
      throw new NotFoundException('Media asset not found');
    }

    asset.active = false;

    if (asset.status === MediaAssetStatus.PENDING_UPLOAD) {
      asset.status = MediaAssetStatus.FAILED;
      asset.error_message = 'Upload cancelled';
    }

    return this.mediaAssetRepository.save(asset);
  }

  async getMediaAssetAccess(userId: string, contentId: string) {
    await this.subscriptionService.checkContentAccess(userId, contentId);

    const asset = await this.mediaAssetRepository.findOne({
      where: {
        content_id: contentId,
        mime_type: 'audio/mpeg',
        status: MediaAssetStatus.READY,
        active: true,
      },
      order: {
        created_at: 'DESC',
      },
    });

    if (!asset) {
      throw new NotFoundException('Media asset not found');
    }

    if (!asset.original_key) {
      throw new NotFoundException('Media file not found');
    }

    const accessUrl = `${process.env.PUBLIC_API_URL}/media-stream/${asset.id}`;

    return {
      content_id: asset.content_id,
      media_asset_id: asset.id,
      type: asset.type,
      provider: asset.provider,
      access_url: accessUrl,
      file_name: asset.file_name,
      mime_type: asset.mime_type,
      size_bytes: asset.size_bytes,
      is_pdf: asset.is_pdf,
    };
  }
}
