import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
    let appController: AppController;
    let appService: AppService;
    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        appController = app.get<AppController>(AppController);
        appService = app.get<AppService>(AppService);
    });

    describe('root', () => {
        it('Controller & Service Defined', () => {
            expect(appController).toBeDefined();
            expect(appController.getAllEndpoint).toBeDefined();
        });

        it('Verify endpoint includes KEYS:', () => {
            const returns = appService.getAllEndpoints();
            expect(returns).toBeTruthy();
            expect(/.*?all.|\r*user.|\r*comment/gm.test(returns)).toBeTruthy();
        });

    });
});
