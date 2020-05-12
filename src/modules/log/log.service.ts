import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map, catchError } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { isNullOrUndefined } from 'util';
import { v4 } from 'uuid';
import { makeObservable } from '../../util/make-observable';
import { LogDTO } from './log.dto';
import { Log } from './log.entity';
import { throwError } from 'rxjs';

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(Log)
        private readonly logRepository: Repository<Log>,
    ) { }

    public save(dto: LogDTO) {
        const log = { ...new Log(v4()), ...dto };
        return makeObservable(this.logRepository.save(log)).pipe(catchError(err => throwError(err)));
    }
    public findOne(logId: string) {
        return makeObservable(this.logRepository.findOne(logId)).pipe(
            map(log => {
                if (isNullOrUndefined(log)) {
                    throw new HttpException(new Error(`Can not find log by log_id ${logId}`), HttpStatus.BAD_REQUEST);
                }
                return log;
            })
        );
    }
}
