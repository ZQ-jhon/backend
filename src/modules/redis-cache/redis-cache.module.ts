import { Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import { REDIS_INJECT_TOKEN } from '../../constants/redis-inject-token';
import { RedisModule } from 'nestjs-redis';
@Module({
  providers: [RedisCacheService],
  imports: [
    RedisModule.register({
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
      name: REDIS_INJECT_TOKEN,
      showFriendlyErrorStack: true,
  }),
  ],
  exports: [RedisCacheService],
})
export class RedisCacheModule { }
