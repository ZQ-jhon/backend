import { Controller, Body, Post, Param, HttpCode, Get, HttpStatus, BadRequestException } from '@nestjs/common';
import { LogService } from './log.service';
import { Log } from './log.entity';
import { Success, Faliure } from 'src/interfaces/success.interface';
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
    public async getLogByUserId(@Param() id: number) {
        try {
            const result = await this.logService.getLog(id);
            return { success: true, value: result } as Success<Log>;
        } catch (err) {
            return { error: err.status, message: err.message } as Faliure<string>;
        }

    }
}
