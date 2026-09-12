import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { stringToHex } from './shared/helpers';
import { Permission } from './permission/entities/permission.entity';
import { PermissionService } from './permission/permission.service';
import { DataSource } from 'typeorm';
import { PermissionValue } from './shared/permission.object';
import { Constant } from './constant/entities/constant.entity';
import { ConstantService } from './constant/constant.service';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { execFile } from 'child_process';

import { createReadStream, createWriteStream, readdir } from 'fs';
import { pipeline } from 'stream/promises';
import { promisify } from 'util';
import { join } from 'path';
import { ContentService } from './content/content.service';
import { rm, unlink } from 'fs/promises';

const readdirAsync = promisify(readdir);

const execFileAsync = promisify(execFile);
@Injectable()
export class AppService {
  private globalPermissions: Permission[];
  private globalConstants: Constant[];
  private readonly s3 = new S3Client({
    region: 'us-east-005',
    endpoint: process.env.B2_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.B2_KEY_ID!,
      secretAccessKey: process.env.B2_APPLICATION_KEY!,
    },
  });
  constructor(
    private readonly dataSource: DataSource,
    private readonly permissionService: PermissionService,
    @Inject(forwardRef(() => ContentService))
    private readonly contentService: ContentService,
    @Inject(forwardRef(() => ConstantService))
    private readonly constantService: ConstantService,
  ) {}

  async uploadFileToB2(localPath: string, key: string, contentType: string) {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME!,

        Key: key,

        Body: createReadStream(localPath),

        ContentType: contentType,
      }),
    );

    return key;
  }
  async generatePresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn = 900,
  ) {
    const command = new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3, command, {
      expiresIn,
    });

    return {
      uploadUrl,
      uploadHeaders: {
        'Content-Type': contentType,
      },
    };
  }
  async listObjects(prefix: string) {
    return this.s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.B2_BUCKET_NAME!,
        Prefix: prefix,
      }),
    );
  }
  async headObject(key: string) {
    return this.s3.send(
      new HeadObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME!,
        Key: key,
      }),
    );
  }

  // async convertToHls(inputPath: string, outputDir: string) {
  //   await execFileAsync('mkdir', ['-p', outputDir]);

  //   await execFileAsync('ffmpeg', [
  //     '-i',
  //     inputPath,

  //     '-c:v',
  //     'libx264',

  //     '-c:a',
  //     'aac',

  //     '-preset',
  //     'veryfast',

  //     '-crf',
  //     '23',

  //     '-f',
  //     'hls',

  //     '-hls_time',
  //     '6',

  //     '-hls_playlist_type',
  //     'vod',

  //     '-hls_segment_filename',
  //     `${outputDir}/segment_%03d.ts`,

  //     `${outputDir}/master.m3u8`,
  //   ]);

  //   return outputDir;
  // }
  // async uploadToB2(file: Express.Multer.File, key: string) {
  //   await this.s3.send(
  //     new PutObjectCommand({
  //       Bucket: process.env.B2_BUCKET_NAME!,
  //       Key: key,
  //       Body: file.buffer,
  //       ContentType: file.mimetype,
  //     }),
  //   );

  //   return key;
  // }

  // async generateSignedUrl(key: string) {
  //   const command = new GetObjectCommand({
  //     Bucket: process.env.B2_BUCKET_NAME!,
  //     Key: key,
  //   });

  //   return getSignedUrl(this.s3, command, {
  //     expiresIn: 60,
  //   });
  // }

  // async downloadFromB2(key: string, outputPath: string) {
  //   const result = await this.s3.send(
  //     new GetObjectCommand({
  //       Bucket: process.env.B2_BUCKET_NAME!,
  //       Key: key,
  //     }),
  //   );

  //   if (!result.Body) {
  //     throw new Error('File not found in B2');
  //   }

  //   await pipeline(
  //     result.Body as NodeJS.ReadableStream,
  //     createWriteStream(outputPath),
  //   );

  //   return outputPath;
  // }
  // async uploadHlsDirectory(localDir: string, b2Prefix: string) {
  //   const files = await readdirAsync(localDir);

  //   for (const file of files) {
  //     const localPath = join(localDir, file);
  //     const b2Key = `${b2Prefix}/${file}`;

  //     let contentType = 'application/octet-stream';

  //     if (file.endsWith('.m3u8')) {
  //       contentType = 'application/vnd.apple.mpegurl';
  //     } else if (file.endsWith('.ts')) {
  //       contentType = 'video/mp2t';
  //     }

  //     await this.s3.send(
  //       new PutObjectCommand({
  //         Bucket: process.env.B2_BUCKET_NAME!,
  //         Key: b2Key,
  //         Body: createReadStream(localPath),
  //         ContentType: contentType,
  //       }),
  //     );

  //     console.log(`Uploaded HLS file: ${b2Key}`);
  //   }

  //   return {
  //     prefix: b2Prefix,
  //     files,
  //   };
  // }

  // async getFileFromB2(key: string): Promise<string> {
  //   const result = await this.s3.send(
  //     new GetObjectCommand({
  //       Bucket: process.env.B2_BUCKET_NAME!,
  //       Key: key,
  //     }),
  //   );

  //   if (!result.Body) {
  //     throw new Error('File not found in B2');
  //   }

  //   return result.Body.transformToString();
  // }

  // async getFileStreamFromB2(key: string) {
  //   const result = await this.s3.send(
  //     new GetObjectCommand({
  //       Bucket: process.env.B2_BUCKET_NAME!,
  //       Key: key,
  //     }),
  //   );

  //   if (!result.Body) {
  //     throw new Error('File not found in B2');
  //   }

  //   return result.Body as NodeJS.ReadableStream;
  // }
  // public sendSMS(
  //   message: string,
  //   GSMs: string,
  //   options?: { autofillCode?: string; useOTPWebHook?: boolean },
  // ) {
  //   const { autofillCode, useOTPWebHook } = options || {};

  //   if (process.env.NODE_ENV === "production") {
  //     if (useOTPWebHook)
  //       axios.post(
  //         `${process.env.AUTH_MTN_SMS_WEBHOOK}/send-sms`,
  //         {
  //           text: stringToHex(
  //             (autofillCode ? "# " : "") +
  //               message +
  //               (autofillCode ? "  " + autofillCode : ""),
  //           ),
  //           GSMs: GSMs,
  //           sender: process.env.SMS_SENDER,
  //         },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         },
  //       );
  //     else
  //       axios.get(
  //         `${process.env.SMS_SERVER_URL}?User=${process.env.SMS_USERNAME}&Pass=${
  //           process.env.SMS_PASSWORD
  //         }&From=${process.env.SMS_SENDER}&Gsm=${GSMs}&Msg=${stringToHex(
  //           (autofillCode ? "# " : "") +
  //             message +
  //             (autofillCode ? "  " + autofillCode : ""),
  //         )}&Lang=0`,
  //       );
  //   }
  // }

  /**
   * Upload original video to B2
   */
  async uploadToB2(file: Express.Multer.File, key: string) {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME!,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return key;
  }

  /**
   * Download file from B2 to local server
   */
  async downloadFromB2(key: string, outputPath: string) {
    const result = await this.s3.send(
      new GetObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME!,
        Key: key,
      }),
    );

    if (!result.Body) {
      throw new Error('File not found in B2');
    }

    await pipeline(
      result.Body as NodeJS.ReadableStream,
      createWriteStream(outputPath),
    );

    return outputPath;
  }

  /**
   * Convert MP4 to HLS
   */
  async convertToHls(inputPath: string, outputDir: string) {
    await execFileAsync('mkdir', ['-p', outputDir]);

    await execFileAsync('ffmpeg', [
      '-y',
      '-i',
      inputPath,

      '-filter_complex',
      [
        '[0:v:0]split=4[v360][v480][v720][v1080]',

        '[v360]scale=w=640:h=360:force_original_aspect_ratio=decrease,' +
          'pad=ceil(iw/2)*2:ceil(ih/2)*2[v360out]',

        '[v480]scale=w=854:h=480:force_original_aspect_ratio=decrease,' +
          'pad=ceil(iw/2)*2:ceil(ih/2)*2[v480out]',

        '[v720]scale=w=1280:h=720:force_original_aspect_ratio=decrease,' +
          'pad=ceil(iw/2)*2:ceil(ih/2)*2[v720out]',

        '[v1080]scale=w=1920:h=1080:force_original_aspect_ratio=decrease,' +
          'pad=ceil(iw/2)*2:ceil(ih/2)*2[v1080out]',
      ].join(';'),

      // 360p
      '-map',
      '[v360out]',
      '-map',
      '0:a:0?',
      '-c:v:0',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      '23',
      '-b:v:0',
      '800k',
      '-maxrate:v:0',
      '856k',
      '-bufsize:v:0',
      '1200k',
      '-c:a:0',
      'aac',
      '-b:a:0',
      '96k',

      // 480p
      '-map',
      '[v480out]',
      '-map',
      '0:a:0?',
      '-c:v:1',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      '23',
      '-b:v:1',
      '1400k',
      '-maxrate:v:1',
      '1498k',
      '-bufsize:v:1',
      '2100k',
      '-c:a:1',
      'aac',
      '-b:a:1',
      '128k',

      // 720p
      '-map',
      '[v720out]',
      '-map',
      '0:a:0?',
      '-c:v:2',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      '23',
      '-b:v:2',
      '2800k',
      '-maxrate:v:2',
      '2996k',
      '-bufsize:v:2',
      '4200k',
      '-c:a:2',
      'aac',
      '-b:a:2',
      '128k',

      // 1080p
      '-map',
      '[v1080out]',
      '-map',
      '0:a:0?',
      '-c:v:3',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      '23',
      '-b:v:3',
      '5000k',
      '-maxrate:v:3',
      '5350k',
      '-bufsize:v:3',
      '7500k',
      '-c:a:3',
      'aac',
      '-b:a:3',
      '192k',

      // HLS
      '-f',
      'hls',
      '-hls_time',
      '6',
      '-hls_playlist_type',
      'vod',
      '-hls_flags',
      'independent_segments',

      '-var_stream_map',
      'v:0,a:0,name:360p ' +
        'v:1,a:1,name:480p ' +
        'v:2,a:2,name:720p ' +
        'v:3,a:3,name:1080p',

      '-master_pl_name',
      'master.m3u8',

      '-hls_segment_filename',
      `${outputDir}/%v/segment_%03d.ts`,

      `${outputDir}/%v/playlist.m3u8`,
    ]);

    return outputDir;
  }

  /**
   * Upload all HLS files to B2
   */
  async uploadHlsDirectory(localDir: string, b2Prefix: string) {
    const uploadedFiles: string[] = [];

    const uploadRecursive = async (
      currentDir: string,
      currentPrefix: string,
    ) => {
      const entries = await readdirAsync(currentDir, {
        withFileTypes: true,
      });

      for (const entry of entries) {
        const localPath = join(currentDir, entry.name);

        if (entry.isDirectory()) {
          const nextPrefix = `${currentPrefix}/${entry.name}`;

          await uploadRecursive(localPath, nextPrefix);

          continue;
        }

        let contentType = 'application/octet-stream';

        if (entry.name.endsWith('.m3u8')) {
          contentType = 'application/vnd.apple.mpegurl';
        } else if (entry.name.endsWith('.ts')) {
          contentType = 'video/mp2t';
        }

        const b2Key = `${currentPrefix}/${entry.name}`;

        await this.s3.send(
          new PutObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME!,
            Key: b2Key,
            Body: createReadStream(localPath),
            ContentType: contentType,
          }),
        );

        uploadedFiles.push(b2Key);

        console.log(`Uploaded HLS file: ${b2Key}`);
      }
    };

    await uploadRecursive(localDir, b2Prefix);

    return {
      prefix: b2Prefix,
      files: uploadedFiles,
    };
  }

  /**
   * Read text file from B2
   */
  async getFileFromB2(key: string): Promise<string> {
    const result = await this.s3.send(
      new GetObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME!,
        Key: key,
      }),
    );

    if (!result.Body) {
      throw new Error('File not found in B2');
    }

    return result.Body.transformToString();
  }

  /**
   * Stream file from B2
   */
  async getFileStreamFromB2(key: string) {
    const result = await this.s3.send(
      new GetObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME!,
        Key: key,
      }),
    );

    if (!result.Body) {
      throw new Error('File not found in B2');
    }

    return result.Body as NodeJS.ReadableStream;
  }

  /**
   * Signed URL - فقط للاختبارات/الملفات العامة المناسبة
   */
  async generateSignedUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME!,
      Key: key,
    });

    return getSignedUrl(this.s3, command, {
      expiresIn: 60,
    });
  }

  async uploadAndProcessVideo(contentId: string, file: Express.Multer.File) {
    // ==========================================
    // 1. Validate content
    // ==========================================

    const content = await this.contentService.findOne({
      id: contentId,
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    // ==========================================
    // 2. Validate file
    // ==========================================

    if (!file) {
      throw new BadRequestException('Video file is required');
    }

    if (!file.mimetype.startsWith('video/')) {
      throw new BadRequestException('Only video files are allowed');
    }

    // ==========================================
    // 3. Generate B2 keys
    // ==========================================

    const timestamp = Date.now();

    const safeFileName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');

    const originalKey = `videos/${contentId}/original/${timestamp}-${safeFileName}`;

    const hlsPrefix = `videos/${contentId}/hls`;

    const hlsKey = `${hlsPrefix}/master.m3u8`;

    // ==========================================
    // 4. Temporary local paths
    // ==========================================

    const videoPath = `/tmp/content-${contentId}-${timestamp}.mp4`;

    const hlsPath = `/tmp/hls-${contentId}-${timestamp}`;

    try {
      // ========================================
      // 5. Upload ORIGINAL video to B2
      // ========================================

      console.log(`Uploading original video: ${originalKey}`);

      await this.uploadToB2(file, originalKey);

      console.log('Original video uploaded successfully');

      // ========================================
      // 6. Save original key in DB
      // ========================================

      await this.contentService.update({
        id: contentId,
        url: originalKey,
      });

      // ========================================
      // 7. Download original from B2
      // ========================================

      console.log(`Downloading original to: ${videoPath}`);

      await this.downloadFromB2(originalKey, videoPath);

      console.log('Original video downloaded');

      // ========================================
      // 8. Convert MP4 → HLS
      // ========================================

      console.log('Starting FFmpeg conversion...');

      await this.convertToHls(videoPath, hlsPath);

      console.log('HLS conversion completed');

      // ========================================
      // 9. Upload HLS to B2
      // ========================================

      console.log(`Uploading HLS to: ${hlsPrefix}`);

      const uploadResult = await this.uploadHlsDirectory(hlsPath, hlsPrefix);

      console.log('HLS uploaded successfully');

      // ========================================
      // 10. Save HLS key in DB
      // ========================================

      await this.contentService.update({
        id: contentId,
        hls_key: hlsKey,
      });

      // ========================================
      // 11. Return everything frontend needs
      // ========================================

      return {
        success: true,

        content_id: contentId,

        status: 'READY',

        original: {
          key: originalKey,
        },

        hls: {
          key: hlsKey,

          playback_url: `/vendor/${contentId}/hls/master.m3u8`,
        },

        files: uploadResult.files,

        expires_in: 300,
      };
    } catch (error) {
      console.error('Video processing failed:', error);

      // ========================================
      // Cleanup local files
      // ========================================

      try {
        await unlink(videoPath);
      } catch {}

      try {
        await rm(hlsPath, {
          recursive: true,
          force: true,
        });
      } catch {}

      throw new HttpException(
        {
          success: false,
          message: 'Video processing failed',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      // ========================================
      // Cleanup local files after success
      // ========================================

      try {
        await unlink(videoPath);
      } catch {}

      try {
        await rm(hlsPath, {
          recursive: true,
          force: true,
        });
      } catch {}
    }
  }
  async onModuleInit() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
    } finally {
      await queryRunner.release();

      await this.setGlobalConstants();
      await this.permissionService.syncPermissions();
      await this.setGlobalPermissions();
    }
  }

  public async setGlobalConstants() {
    this.globalConstants = await this.constantService.findAll();
    console.log(this.globalConstants);
  }

  public async setGlobalPermissions() {
    const result = await this.permissionService.findAll({
      pagination: { limit: 10000, page: 1 },
    });

    this.globalPermissions = result.items;

    console.log(this.globalPermissions);
  }
}
