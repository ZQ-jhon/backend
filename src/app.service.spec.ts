import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
    let appService: AppService;
    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [AppService],
        }).compile();

        appService = app.get<AppService>(AppService);
    });

    describe('AppService', () => {
        it('Verify endpoint includes KEYS:', () => {
            expect(appService).toBeDefined();
            expect(appService.getAllEndpoints).toBeDefined();
            expect(appService).toHaveProperty(['getAllEndpoints']);
        });
        it('Send JSONP data', () => {
            const callbackName = 'handle';
            const mockFn = jest.fn(appService.sendJSONPData);
            expect(mockFn(callbackName)).toMatch(new RegExp(`^${callbackName}`, 'g'));
            expect(mockFn).toBeCalledTimes(1);
        });
    });
});
