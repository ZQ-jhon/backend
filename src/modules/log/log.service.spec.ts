import { Test } from '@nestjs/testing';
import { LogService } from './log.service';
import { Log } from './log.entity';

describe('LogService', () => {
    const service = { save: () => new Log(), findOne: () => new Log() };

    beforeEach(async () => {
        await Test.createTestingModule({
            providers: [LogService],
        })
            .overrideProvider(LogService)
            .useValue(service)
            .compile();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
