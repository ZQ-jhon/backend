import { Module } from '@nestjs/common';
import { RedisClientService } from './redis-client.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { REDIS_INJECT_TOKEN } from '../../constants/redis-inject-token';
@Module({
  providers: [RedisClientService],
  imports: [
    ClientsModule.register([
      {
        name: REDIS_INJECT_TOKEN,
        transport: Transport.REDIS,
        options: {
          url: 'redis://localhost:6379',
        }
      },
    ])
  ],
  exports: [RedisClientService],
})
export class RedisClientModule { }
