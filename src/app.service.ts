import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    public getAllEndpoints(baseUrl = 'http://127.0.0.1:3000') {
        return {
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
        };
    }
    public sendJSONPData(callbackName: string) {
        return `${callbackName}(${JSON.stringify({
            data: 'hello',
            timestamp: new Date().toUTCString(),
            status: 200,
            requestBy: 'JSONP',
        })})`;
    }
}
