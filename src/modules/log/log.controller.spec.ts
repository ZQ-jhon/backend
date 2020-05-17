import { Test, TestingModule } from '@nestjs/testing';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { Log } from './log.entity';

describe('Log Controller', () => {
    let controller: LogController;
    const service = { save: () => new Log(), findOne: () => new Log() };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LogController],
            providers: [LogService],
        })
        .overrideProvider(LogService)
        .useValue(service)
        .compile();

        controller = module.get<LogController>(LogController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
