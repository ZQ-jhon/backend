import { Controller, Body, Post, Param, HttpCode, Get } from '@nestjs/common';
import { LogService } from './log.service';
import { Log } from './log.entity';
@Controller('log')
export class LogController {
    constructor(
        private readonly logService: LogService,
    ) { }

    @Post(':id')
    @HttpCode(201)
    public async setLog(@Param() id: number = 1, @Body() log: Partial<Log>) {
        return await this.logService.setLog(log);
    }

    @Get(':id')
    public async getLogByUserId(@Param() id: number = 1) {
        return await this.logService.getLog(id);
    }
}
