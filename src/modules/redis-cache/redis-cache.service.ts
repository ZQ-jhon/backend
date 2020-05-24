import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { REDIS_INJECT_TOKEN } from '../../constants/redis-inject-token';

@Injectable()
export class RedisCacheService {
    private client;
    constructor(
        private readonly redisService: RedisService,
    ) {
        this.getClient();
    }

    private async getClient() {
        this.client = await this.redisService.getClient(REDIS_INJECT_TOKEN);
    }
    public set<K = string, V = any>(key: K, value: V, expire?: number) {
        const args = expire ? [key, value ,'NX', expire] : [key, value];
        return this.client.set(...args) as Promise<"OK">;
    }
    public get<K = string>(key: K) {
        return this.client.get(key) as Promise<any>;
    }
    public empty() {
        return this.client.flushall() as Promise<"OK">;
    }
}
