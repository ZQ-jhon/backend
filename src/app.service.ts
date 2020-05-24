import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    private baseUrl = `http://127.0.0.1:3000`;
    public getAllEndpoints() {
        return {
            all: {
                '[EndPoint] For all endpoints               ': 'GET ' + this.baseUrl,
            },
            auth: {
                '[Auth API] Login                           ': 'POST ' + this.baseUrl + '/auth/login body: [UserDto]',
                '[Auth API] Redeem token                    ': 'POST ' + this.baseUrl + '/auth/token header [Bearer authorization]',
                '[Auth API] Create user                     ': 'POST ' + this.baseUrl + '/auth/user body [UserDto]',
            },
            user: {
                '[User API] GET one user                    ': 'GET  ' + this.baseUrl + '/user/{userIdOrUsername}',
                '[User API] GET users                       ': 'GET  ' + this.baseUrl + '/user?offset={offset}&limit={limit}',
            },
            comment: {
                '[comment  API] POST one comment            ': 'POST ' + this.baseUrl + '/comment body: {userId: string, content: string }',
                '[comment  API] GET one comment             ': 'GET  ' + this.baseUrl + '/comment/:id',
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
