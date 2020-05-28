import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
    let appController: AppController;
    let appService: AppService;
    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [
                {
                    provide: 'AppService',
                    useClass: AppService,
                }
            ],
        }).compile();

        appController = app.get<AppController>(AppController);
        appService = app.get<AppService>(AppService);
    });

    describe('root', () => {
        it('Controller & Service Defined', () => {
            expect(appController).toBeDefined();
            const mockFn = jest.fn(appController.getAllEndpoint);
            expect(mockFn).toBeDefined();
        });

        it('Verify endpoint includes KEYS:', () => {
            const mockFn = jest.fn(appService.getAllEndpoints);
            const returns = mockFn();
            expect(returns).toBeTruthy();
            expect(/.*?all.|\r*user.|\r*comment/gm.test(JSON.stringify(returns))).toBeTruthy();
        });
        it('Test JSONP request', () => {
            const callbackName = 'callback';
            const serviceMockFn = jest.fn(appService.sendJSONPData);
            expect(serviceMockFn(callbackName)).toContain(callbackName);
        });
    });
});
