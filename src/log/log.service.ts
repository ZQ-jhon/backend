import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Log } from './log.entity';
const makeObservable = <T>(promise: Promise<T>) => from(promise);
@Injectable()
export class LogService {
    constructor(
        @InjectRepository(Log)
        private readonly logRepository: Repository<Log>,
    ) { }
    public setLog(log: Log) {
        if (!log.id) { log.id = v4(); }
        console.log(log);
        return this.logRepository.save(log);
    }
    public getLog(logId: string) {
        return this.logRepository.findOne(logId);
    }
    public getAllLogByUserId(userId: string) {
        const log$ = this.logRepository.query(
            `SELECT * FROM test.log`
        ) as Promise<Log[]>;
        return makeObservable(log$).pipe(
            map(logs => logs),
        );
    }
}
