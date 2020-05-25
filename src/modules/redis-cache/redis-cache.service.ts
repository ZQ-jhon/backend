import { Injectable } from '@nestjs/common';
import { KeyType, Redis, ValueType } from 'ioredis';
import { RedisService } from 'nestjs-redis';
import { from } from 'rxjs';
import { REDIS_INJECT_TOKEN } from '../../constants/redis-inject-token';
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
        return from(this.client.set(key, value, expire));
    }
    public get(key: KeyType) {
        return from(this.client.get(key));
    }
    public empty() {
        return from(this.client.flushall());
    }
}
