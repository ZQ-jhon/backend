import { Controller, Get, HttpCode, Header } from '@nestjs/common';
import { AppService } from './app.service';
import { runInThisContext } from 'vm';

@Controller('')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    public getAllEndpoint() {
        return `<pre> ${this.appService.getAllEndpoints()} </pre>`;
    }
}
