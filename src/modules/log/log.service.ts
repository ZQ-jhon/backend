import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { isNullOrUndefined } from 'util';
import { v4 } from 'uuid';
import { LogDTO } from './log.dto';
import { Log } from './log.entity';

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(Log)
        private readonly logRepository: Repository<Log>
    ) { }

    public save(dto: LogDTO) {
        if (!dto) {
            return throwError(new BadRequestException('Log DTO is not provide'));
        }
        const log = { ...new Log(v4()), ...dto } as Log;
        return from(this.logRepository.save(log)).pipe(catchError(err => throwError(err)));
    }
    public findOne(logId: string) {
        return from(this.logRepository.findOne(logId)).pipe(
            map(log => {
                if (isNullOrUndefined(log)) {
                    throw new HttpException(new Error(`Can not find log by log_id ${logId}`), HttpStatus.BAD_REQUEST);
                }
                return log;
            }),
            catchError(err => {
                return throwError(new BadRequestException(err.message));
            }),
        );
    }
}
