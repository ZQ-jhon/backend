import { Test, TestingModule } from '@nestjs/testing';
import { ValueType } from 'ioredis';
import { Redis } from 'ioredis';
import { of } from 'rxjs';
import { RedisCacheService } from './redis-cache.service';
import { REDIS_INJECT_TOKEN } from '../../constants/redis-inject-token';
describe('RedisClientService', () => {
  let service: RedisCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'RedisService',
          useValue: {
            // FIXME: 类型
            getClient: (token: string = REDIS_INJECT_TOKEN) => Promise.resolve(token as any as Redis) as Promise<Redis>,
          }
        },
        {
          provide: 'RedisCacheService',
          useValue: {
            set: (key: KeyType, value: ValueType, time: number) => of('OK'),
            get: (key: KeyType) => of(''),
            empty: () => of('OK'),
          }
        },
      ],
    })
      .compile();

    service = module.get<RedisCacheService>(RedisCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
