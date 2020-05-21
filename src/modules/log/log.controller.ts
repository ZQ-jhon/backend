import { Controller, Post, Get, Param, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { LogService } from './log.service';
import { LogDTO } from './log.dto';
import { Log } from './log.entity';
import { AuthGuard } from '../auth/auth.guard';
import { ResponseInterceptor } from '../../interceptors/response.interceptor';

@Controller('log')
@UseGuards(AuthGuard)
@UseInterceptors(ResponseInterceptor)
export class LogController {
    constructor(private readonly logService: LogService) { }

    @Post()
    public async save(@Body() logDTO: LogDTO) {
        return await this.logService.save(logDTO).toPromise() as Log;
    }

    @Get('/:logId')
    public async find(@Param('logId') logId: string) {
        return await this.logService.findOne(logId).toPromise() as Log;
    }
}
