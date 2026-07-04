import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { RedisService } from '../redis/redis.service';
import { UAParser } from 'ua-parser-js';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class SessionsService {
  constructor(private readonly redisService: RedisService) { }

  private buildKey(token: string, userId: string): string {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    return `auth::refresh_token:${userId}:${hashedToken}`;
  }

  async createSession(
    userId: string,
    refreshToken: string,
    userAgent: string,
    expiresInSeconds: number,
  ) {
    const redisKey = this.buildKey(refreshToken, userId);

    const parser = new UAParser(userAgent);

    const device = parser.getDevice();

    const browser = parser.getBrowser();

    const os = parser.getOS();

    const deviceName = `${os.name || 'Unknown OS'} - ${browser.name || 'Unknown Browser'}`;

    const deviceType = device.type || 'desktop';

    const sessionInfo = {
      sessionId: crypto.randomUUID(),
      deviceName: deviceName,
      deviceType: deviceType,
      userAgent: userAgent,
      loginAt: new Date(),
    };

    await this.redisService.set(redisKey, sessionInfo, expiresInSeconds);
  }

  async getAllUserSessions(userId: string, currentRefreshToken: string) {
    const currentRedisKey = this.buildKey(currentRefreshToken, userId);

    const pattern = `auth::refresh_token:${userId}:*`;

    const keys = await this.redisService.keys(pattern);

    if (keys.length === 0) return [];

    const sessionsData = await this.redisService.mget(keys);

    return keys.map((key, index) => {
      return {
        isCurrent: key === currentRedisKey,
        ...sessionsData[index],
      };
    });
  }

  async removeCurrentSession(
    userId: string,
    currentRefreshToken: string,
  ): Promise<void> {
    const currentRedisKey = this.buildKey(currentRefreshToken, userId);

    await this.redisService.del(currentRedisKey);
  }

  async removeSessionBySessionId(user: JwtPayload, targetSessionId: string) {
    const pattern = `auth::refresh_token:${user.sub}:*`;
    const keys = await this.redisService.keys(pattern);

    if (keys.length === 0) return;

    const sessionsData = await this.redisService.mget(keys);

    for (let i = 0; i < sessionsData.length; i++) {
      const sessionInfo = sessionsData[i]
      if (sessionInfo) {
        if (sessionInfo.sessionId === targetSessionId) {
          await this.redisService.del(keys[i])
          return
        }
      }
    }
  }

  async checkSession(
    userId: string,
    currentRefreshToken: string,
  ): Promise<boolean> {
    const keyRedis = this.buildKey(currentRefreshToken, userId);

    const session = await this.redisService.get(keyRedis);

    return session !== null;
  }
}
