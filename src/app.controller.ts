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
import { MediaAssetStatus } from './shared/enums/media_asset.enum';
import { SubscriptionService } from './subscription/subscription.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly contentService: ContentService,
    private readonly videoStreamService: VideoStreamService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

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

    const path = fullPath.replace(/^\/vendor\/video-stream/, '');

    // 1️⃣ تحقق من token الموجود بالرابط
    const tokenPayload = this.videoStreamService.verifyToken(token, path);

    // 2️⃣ جيب cookie
    const playbackCookie = req.cookies?.video_playback;

    if (!playbackCookie) {
      throw new UnauthorizedException('Missing playback session');
    }

    // 3️⃣ تحقق من صحة وتوقيع cookie
    const cookiePayload =
      this.videoStreamService.verifyPlaybackCookie(playbackCookie);

    // 4️⃣ نفس المستخدم
    if (cookiePayload.user_id !== tokenPayload.user_id) {
      throw new UnauthorizedException('Playback access denied');
    }

    // 5️⃣ نفس المحتوى
    if (cookiePayload.content_id !== tokenPayload.content_id) {
      throw new UnauthorizedException('Playback content mismatch');
    }

    // 6️⃣ تحقق أن المستخدم عنده صلاحية على المحتوى
    const hasAccess = await this.subscriptionService.checkContentAccess(
      cookiePayload.user_id,
      cookiePayload.content_id,
    );

    if (!hasAccess) {
      throw new UnauthorizedException('You do not have access to this content');
    }

    // 7️⃣ بعد نجاح كل التحققات فقط نجيب الملف من B2
    const key = path.replace(/^\/+/, '');

    const stream = await this.appService.getFileStreamFromB2(key);

    // HLS playlist
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

    // TS segments
    if (key.endsWith('.ts')) {
      res.setHeader('Content-Type', 'video/mp2t');
    }

    stream.pipe(res);
  }

  @Get('media-stream/:mediaAssetId')
  async mediaStream(
    @Param('mediaAssetId') mediaAssetId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const playbackCookie = req.cookies?.media_playback;

    if (!playbackCookie) {
      throw new UnauthorizedException('Missing playback session');
    }

    const cookiePayload =
      this.videoStreamService.verifyPlaybackCookie(playbackCookie);

    const asset = await this.contentService.findOneMediaAsset({
      id: mediaAssetId,
      status: MediaAssetStatus.READY,
      active: true,
    });

    if (!asset) {
      throw new NotFoundException('Media asset not found');
    }

    if (!asset.original_key) {
      throw new NotFoundException('Media file not found');
    }

    // الـ cookie يجب أن تكون لنفس الـ content
    if (cookiePayload.content_id !== asset.content_id) {
      throw new UnauthorizedException('Playback content mismatch');
    }

    // التحقق من صلاحية المستخدم على الـ content
    const hasAccess = await this.subscriptionService.checkContentAccess(
      cookiePayload.user_id,
      asset.content_id,
    );

    if (!hasAccess) {
      throw new UnauthorizedException('You do not have access to this content');
    }

    const stream = await this.appService.getFileStreamFromB2(
      asset.original_key,
    );

    res.setHeader(
      'Content-Type',
      asset.mime_type || 'application/octet-stream',
    );

    res.setHeader('Content-Disposition', 'inline');

    stream.pipe(res);
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
