import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { of, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { makeObservable } from '../util/make-observable';
import { Log } from './log.entity';
import { catchError } from 'rxjs/operators';
import { errThrowerBuilder } from '../util/err-thrower-builder';

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(Log)
        private readonly logRepository: Repository<Log>,
    ) { }
    public setLog(log: Log) {
        if (!log.id) { log.id = v4(); }
        return makeObservable(this.logRepository.save(log)).pipe(
            catchError(err => errThrowerBuilder(err, '保存日志出错', HttpStatus.SERVICE_UNAVAILABLE))
        );
    }
    public getLog(logId: string) {
        if (!logId) {
            return throwError(new HttpException(`没有 logId，无法进行精确日志查询!`, HttpStatus.PAYMENT_REQUIRED));
        }
        return makeObservable(this.logRepository.findOne(logId));
    }
}
