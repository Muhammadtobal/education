import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Headers,
  UploadedFile,
  NotFoundException,
  Param,
  Req,
  Res,
  Body,
  BadRequestException,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { exec } from 'child_process';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContentService } from './content/content.service';
import { JwtAuthSharedGuard } from './auth/guards/jwt-auth-shared.guard';
import { getUserId } from './shared/helpers';
import { Request, Response } from 'express';
import { VideoStreamService } from './content/processors/video-stream.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly contentService: ContentService,
    private readonly videoStreamService: VideoStreamService,
  ) {}

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async upload(@UploadedFile() file: Express.Multer.File) {
  //   const key = `test/${Date.now()}-${file.originalname}`;

  //   const result = await this.appService.uploadToB2(file, key);

  //   return {
  //     key: result,
  //   };
  // }

  @Get('video-stream/*')
  async stream(
    @Req() req: Request,
    @Res() res: Response,
    @Query('token') token?: string,
  ) {
    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    const fullPath = req.path;

    // /vendor/video-stream/videos/33/hls/3/master.m3u8
    const path = fullPath.replace(/^\/vendor\/video-stream/, '');

    this.videoStreamService.verifyToken(token, path);

    const key = path.replace(/^\/+/, '');

    const stream = await this.appService.getFileStreamFromB2(key);

    if (key.endsWith('.m3u8')) {
      const chunks: Buffer[] = [];

      for await (const chunk of stream as any) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }

      let playlist = Buffer.concat(chunks).toString('utf8');

      playlist = playlist
        .split('\n')
        .map((line) => {
          const trimmed = line.trim();

          if (!trimmed || trimmed.startsWith('#')) {
            return line;
          }

          const separator = trimmed.includes('?') ? '&' : '?';

          return `${line}${separator}token=${encodeURIComponent(token)}`;
        })
        .join('\n');

      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');

      return res.send(playlist);
    }

    if (key.endsWith('.ts')) {
      res.setHeader('Content-Type', 'video/mp2t');
    }

    stream.pipe(res);
  }
  @Get('test-url')
  async getTestUrl() {
    const key = 'test/1789024224421-images (8).jpeg';

    const url = await this.appService.generateSignedUrl(key);

    return {
      url,
      expires_in: 60,
    };
  }

  // @Get('test-download/:contentId')
  // async testDownload(@Param('contentId') contentId: string) {
  //   const content = await this.contentService.findOne({
  //     id: contentId,
  //   });

  //   if (!content) {
  //     throw new NotFoundException('Content not found');
  //   }

  //   if (!content.url) {
  //     throw new NotFoundException('Video key not found');
  //   }

  //   // 1. مكان الفيديو المؤقت
  //   const videoPath = `/tmp/test-${contentId}.mp4`;

  //   // 2. مكان ملفات HLS المؤقتة
  //   const hlsPath = `/tmp/hls-${contentId}`;

  //   // 3. نزّل الفيديو من B2 إلى السيرفر
  //   await this.appService.downloadFromB2(content.url, videoPath);

  //   // 4. حوّل MP4 إلى HLS
  //   await this.appService.convertToHls(videoPath, hlsPath);

  //   // 5. المسار الذي سنرفع عليه HLS داخل B2
  //   const hlsPrefix = `videos/${contentId}/hls`;

  //   // 6. ارفع master.m3u8 والـ segments إلى B2
  //   const uploadResult = await this.appService.uploadHlsDirectory(
  //     hlsPath,
  //     hlsPrefix,
  //   );

  //   await this.contentService.update({
  //     id: contentId,
  //     hls_key: `${hlsPrefix}/master.m3u8`,
  //   });

  //   return {
  //     success: true,
  //     videoPath,
  //     hlsPath,
  //     uploadResult,
  //   };
  // }

  // @UseGuards(JwtAuthSharedGuard)
  // @Get(':contentId/hls/master.m3u8')
  // async getHlsMaster(
  //   @Param('contentId') contentId: string,
  //   @Req() req: any,
  //   @Res() res: Response,
  // ) {
  //   const user = req.user;
  //   const userId = getUserId(user);

  //   const playlist = await this.contentService.getHlsMaster(userId, contentId);

  //   res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');

  //   return res.send(playlist);
  // }

  @UseGuards(JwtAuthSharedGuard)
  @Get(':contentId/hls/:segment')
  async getHlsSegment(
    @Param('contentId') contentId: string,
    @Param('segment') segment: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const user = req.user;
    const userId = getUserId(user);

    const result = await this.contentService.getHlsSegment(
      userId,
      contentId,
      segment,
    );

    res.setHeader('Content-Type', 'video/mp2t');

    result.pipe(res);
  }

  @Post('upload-video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { contentId: string },
  ) {
    console.log('========== UPLOAD VIDEO ==========');
    console.log('FILE:', file);
    console.log('BODY:', body);
    console.log('CONTENT ID:', body?.contentId);

    if (!file) {
      throw new BadRequestException('Video file is required');
    }

    if (!body?.contentId) {
      throw new BadRequestException('contentId is required');
    }

    return this.appService.uploadAndProcessVideo(body.contentId, file);
  }
  @Post('selfDeploy')
  selfDeploy(@Headers('x-gitlab-token') token: string) {
    if (token !== process.env.DEPLOY_SECRET)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    console.log('selfDeploy started');

    new Promise((resolve, reject) => {
      exec(
        `bash ${process.env.DEPLOY_SCRIPT_PATH}`,
        { cwd: `${process.cwd()}` },
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            reject({ success: false, error: stderr });
          } else resolve({ success: true, log: stdout });
        },
      );
    });

    return { deployed: true };
  }
}
