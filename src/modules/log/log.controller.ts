import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { LogService } from './log.service';
import { LogDTO } from './log.dto';
import { Success } from 'src/interfaces/success.interface';
import { Log } from './log.entity';

@Controller('log')
export class LogController {
    constructor(
        private readonly logService: LogService,
    ) { }

    @Post()
    public async save(@Body() logDTO: LogDTO) {
        return { success: true, value: await this.logService.save(logDTO).toPromise() } as Success<Log>;
    }

    @Get('/:logId')
    public async find(@Param('logId') logId: string) {
        return { success: true, value: await this.logService.findOne(logId).toPromise() } as Success<Log>;
    }
}
