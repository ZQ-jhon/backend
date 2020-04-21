import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    private baseUrl = `http://127.0.0.1:3000`;
    public getAllEndpoints() {
        return {
            '[EndPoint] For all endpoints': `GET ${this.baseUrl}`,
            '[User API] Save a user'               : `POST ${this.baseUrl}/user body: {id: string, name: string, log: Log, password: string}`,
            '[User API] Get one user'              : `GET  ${this.baseUrl}/user/:id `,
            '[User API] Get user by limit & offset': `GET  ${this.baseUrl}/user?offset={offset}&limit={limit}`,
            '[Log  API] Save a log '               : `POST ${this.baseUrl}/log body: {userId: string, content: string }`,
            '[Log  API] Get one log'               : `GET  ${this.baseUrl}/log/:id`
        };
    }
}
