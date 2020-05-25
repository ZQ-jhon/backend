import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { REDIS_INJECT_TOKEN } from '../../constants/redis-inject-token';
import { Redis, KeyType, ValueType } from 'ioredis';
import { from } from 'rxjs';
@Injectable()
export class RedisCacheService {
    private client: Redis;
    constructor(
        private readonly redisService: RedisService,
    ) {
        this.getClient();
    }

    private async getClient() {
        this.client = await this.redisService.getClient(REDIS_INJECT_TOKEN);
    }
    public set(key: KeyType, value: ValueType, expire?: string | any[]) {
        if (expire) {
            return from(this.client.set(key, value, expire));
        } else {
            return from(this.client.set(key, value));
        }
    }
    public get(key: KeyType) {
        return from(this.client.get(key));
    }
    public publish(channel: string, message: string) {
        return from(this.client.publish(channel, message));
    }
    public subscribe(channel: string) {
        return from(this.client.subscribe(channel));
    }
    public empty() {
        return from(this.client.flushall());
    }
}
