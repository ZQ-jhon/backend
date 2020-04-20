import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(Log)
        private readonly logRepository: Repository<Log>,
    ) {}
    public async setLog(log: Partial<Log>) {
        return this.logRepository.save(log);
    }
    public getLog(logId: number) {
        return this.logRepository.findOne(logId);
    }
}
