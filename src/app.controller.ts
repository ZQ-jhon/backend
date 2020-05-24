import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    public getAllEndpoint() {
        return `<pre> ${JSON.stringify(this.appService.getAllEndpoints(), null, 4)} </pre>`;
    }

    @Get('jsonp')
    public sendData(@Query('callback_name') callbackName: string) {
        return this.appService.sendJSONPData(callbackName);
    }
}
