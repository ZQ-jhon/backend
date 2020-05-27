import { Test, TestingModule } from '@nestjs/testing';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { Log } from './log.entity';
import { getRepositoryToken } from '@nestjs/typeorm/dist/common';
import { User } from '../user/user.entity';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { ValueType } from 'ioredis';
import { of } from 'rxjs';

describe('Log Controller', () => {
    let controller: LogController;
    const redisCacheService = {
        redisService: { getClient: (token: string) => null },
        set: (key: KeyType, value: ValueType, time: number) => of('OK'),
        get: (key: KeyType) => of(''),
        empty: () => of('OK'),
      };
    const service = { save: () => new Log(), findOne: () => new Log() };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LogController],
            providers: [
                LogService,
                RedisCacheService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOne: (id: string) => new Promise(res => res(new Comment(id))),
                    },
                }
            ],
        })
            .overrideProvider(LogService)
            .useValue(service)
            .overrideProvider(RedisCacheService)
            .useValue(redisCacheService)
            .compile();

        controller = module.get<LogController>(LogController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
