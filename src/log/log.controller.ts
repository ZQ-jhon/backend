import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { Success } from 'src/interfaces/success.interface';
import { Log } from './log.entity';
import { LogService } from './log.service';
@Controller('log')
export class LogController {
    constructor(
        private readonly logService: LogService,
    ) { }

    /**
     * 构建一条 log
     */
    @Post()
    @HttpCode(201)
    public async setLog(@Body() log: Log) {
        const result = await this.logService.setLog(log).toPromise();
        return { success: true, value: result } as Success<Log>;

    }

    /**
     * 根据 id 查询一条 log
     */
    @Get(':id')
    public async getLogByUserId(@Param() param: { id: string }) {
        const result = await this.logService.getLog(param.id).toPromise();
        return { success: true, value: result } as Success<Log>;


    }

}
