import { Controller, Get, Query, HttpException } from "@nestjs/common";
import { LogService } from "./log.service";

@Controller('logs')
export class LogsController {
    constructor(
        private readonly logService: LogService,
    ) {}
    @Get('')
    public async getUserAllLogs(@Query() query: { userId: string }) {
        if (!query.userId) { new HttpException('No userId in query params!', 402); }
        return await this.logService.getAllLogByUserId(query.userId).toPromise();
    }

}