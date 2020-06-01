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
            jest.spyOn(appService, 'getAllEndpoints').mockImplementation((baseUrl = 'localhost:3000') => ({
                all: {
                    '[EndPoint] For all endpoints               ': 'GET ' + baseUrl,
                },
                auth: {
                    '[Auth API] Login                           ': 'POST ' + baseUrl + '/auth/login body: [UserDto]',
                    '[Auth API] Redeem token                    ': 'POST ' + baseUrl + '/auth/token header [Bearer authorization]',
                    '[Auth API] Create user                     ': 'POST ' + baseUrl + '/auth/user body [UserDto]',
                },
                user: {
                    '[User API] GET one user                    ': 'GET  ' + baseUrl + '/user/{userIdOrUsername}',
                    '[User API] GET users                       ': 'GET  ' + baseUrl + '/user?offset={offset}&limit={limit}',
                },
                comment: {
                    '[comment  API] POST one comment            ': 'POST ' + baseUrl + '/comment body: {userId: string, content: string }',
                    '[comment  API] GET one comment             ': 'GET  ' + baseUrl + '/comment/:id',
                },
            }));
            expect(/^<pre> all.|\r*user.|\r*comment/gm.test(appController.getAllEndpoint())).toBeTruthy();
        });
        it('Test JSONP request', () => {
            const callbackName = 'callback';
            jest.spyOn(appService, 'sendJSONPData').mockImplementation((callbackName: string) => {
                return `${callbackName}(${JSON.stringify({
                    data: 'hello',
                    timestamp: new Date().toUTCString(),
                    status: 200,
                    requestBy: 'JSONP',
                })})`;
            });
            expect(appController.sendData(callbackName)).toContain(callbackName);
            expect(appController.sendData(null).startsWith(callbackName)).toBeTruthy();
        });
    });
});
