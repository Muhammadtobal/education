import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

@Injectable()
export class VideoStreamService {
  private readonly secret = process.env.VIDEO_STREAM_SECRET!;

  private readonly ttl = Number(
    process.env.VIDEO_STREAM_TOKEN_TTL_SECONDS || 300,
  );

  getTokenTtl() {
    return this.ttl;
  }

  generateToken(params: {
    userId: string;
    contentId: string;
    assetId: string;
    pathPrefix: string;
  }): string {
    const payload = {
      user_id: params.userId,
      content_id: params.contentId,
      asset_id: params.assetId,
      path_prefix: params.pathPrefix,
      exp: Math.floor(Date.now() / 1000) + this.ttl,
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      'base64url',
    );

    const signature = createHmac('sha256', this.secret)
      .update(encodedPayload)
      .digest('hex');

    return `${encodedPayload}.${signature}`;
  }

  verifyToken(token: string, requestedPath: string) {
    const [encodedPayload, signature] = token.split('.');

    if (!encodedPayload || !signature) {
      throw new UnauthorizedException('Invalid token');
    }

    const expectedSignature = createHmac('sha256', this.secret)
      .update(encodedPayload)
      .digest('hex');

    if (
      signature.length !== expectedSignature.length ||
      !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      throw new UnauthorizedException('Invalid token');
    }

    let payload: {
      user_id: string;
      content_id: string;
      asset_id: string;
      path_prefix: string;
      exp: number;
    };

    try {
      payload = JSON.parse(
        Buffer.from(encodedPayload, 'base64url').toString('utf8'),
      );
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Token expired');
    }

    if (!requestedPath.startsWith(payload.path_prefix)) {
      throw new UnauthorizedException('Invalid path');
    }

    return payload;
  }

  createPlaybackCookie(userId: string): string {
    const payload = Buffer.from(
      JSON.stringify({
        user_id: userId,
        exp: Math.floor(Date.now() / 1000) + 600,
      }),
    ).toString('base64url');

    const signature = createHmac('sha256', this.secret)
      .update(payload)
      .digest('hex');

    return `${payload}.${signature}`;
  }

  verifyPlaybackCookie(cookie: string) {
    const [encodedPayload, signature] = cookie.split('.');

    if (!encodedPayload || !signature) {
      throw new UnauthorizedException('Invalid playback cookie');
    }

    const expectedSignature = createHmac('sha256', this.secret)
      .update(encodedPayload)
      .digest('hex');

    if (
      signature.length !== expectedSignature.length ||
      !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      throw new UnauthorizedException('Invalid playback cookie');
    }

    let payload: {
      user_id: string;
      exp: number;
    };

    try {
      payload = JSON.parse(
        Buffer.from(encodedPayload, 'base64url').toString('utf8'),
      );
    } catch {
      throw new UnauthorizedException('Invalid playback cookie');
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Playback session expired');
    }

    return payload;
  }
}
