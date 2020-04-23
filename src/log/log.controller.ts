import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, Param, Post, Query } from '@nestjs/common';
import { Faliure, Success } from 'src/interfaces/success.interface';
import { Log } from './log.entity';
import { LogService } from './log.service';
import { v4 } from 'uuid';
@Controller('log')
export class LogController {
    private buildfailureResponse = (code: number, msg: string) => ({ error: code, message: msg }) as Faliure<string>;

    constructor(
        private readonly logService: LogService,
    ) { }

    /**
     * 构建一条 log
     */
    @Post()
    @HttpCode(201)
    public async setLog(@Body() log: Log) {
        if (!log.id) { log.id = v4(); }
        try {
            const result = await this.logService.setLog(log);
            return { success: true, value: result } as Success<Log>;
        } catch (err) {
            console.log(err);
            throw new BadRequestException(this.buildfailureResponse(402, 'POST 凭据字段不全，应该有 content 以及 userId'));
        }

    }

    /**
     * 根据 id 查询一条 log
     */
    @Get(':id')
    public async getLogByUserId(@Param() id: string) {
        try {
            const result = await this.logService.getLog(id);
            if (!result) { throw new Error('Log id is not exist!'); }
            return { success: true, value: result } as Success<Log>;
        } catch (err) {
            return { error: err.status, message: err.message } as Faliure<string>;
        }

    }

}
