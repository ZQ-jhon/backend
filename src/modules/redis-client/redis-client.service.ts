import { Injectable, Inject } from '@nestjs/common';
import { REDIS_INJECT_TOKEN } from '../../constants/redis-inject-token';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RedisClientService {
    constructor(
        @Inject(REDIS_INJECT_TOKEN)
        private readonly client: ClientProxy,
    ) {
        console.log(this.client);
    }
}
