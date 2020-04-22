import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.entity';
import { v4 } from 'uuid';

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(Log)
        private readonly logRepository: Repository<Log>,
    ) {}
    public setLog(log: Log) {
        if (!log.id) { log.id = v4(); }
        return this.logRepository.save(log);
    }
    public getLog(logId: number) {
        return this.logRepository.findOne(logId);
    }
}
