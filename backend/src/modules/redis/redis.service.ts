import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
    constructor(
        @InjectRedis() private readonly redis: Redis,
    ) { }

    async set(key: string, value: any, ttlInSeconds?: number): Promise<void> {
        const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value)

        if (ttlInSeconds) {
            await this.redis.set(key, stringValue, "EX", ttlInSeconds)
        }
        else {
            await this.redis.set(key, stringValue)
        }
    }

    async get<T>(key: string): Promise<null | T> {
        const data = await this.redis.get(key)

        if (!data) return null

        try {
            return JSON.parse(data)
        } catch (e) {
            return data as any
        }
    }

    async del(key: string): Promise<void> {
        await this.redis.del(key)
    }

    async keys(pattern: string): Promise<string[]> {
        return await this.redis.keys(pattern)
    }

    async mget(keys: string[]): Promise<any[]> {
        if (keys.length === 0) return [];
        const data = await this.redis.mget(...keys);

        return data.map(item => {
            if (!item) return null
            try {
                return JSON.parse(item)
            } catch (e) {
                return item;
            }
        })
    }

    getClient(): Redis {
        return this.redis;
    }
}
