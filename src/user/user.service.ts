import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { combineLatest, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Repository, QueryBuilder } from 'typeorm';
import { v4 } from 'uuid';
import { Log } from '../log/log.entity';
import { makeObservable } from '../util/make-observable';
import { User } from './user.entity';
import { errThrowerBuilder } from '../util/err-thrower-builder';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Log)
        private readonly logRepository: Repository<Log>,
    ) { }

    public save(user: User) {
        if (!user.id) { user.id = v4(); }
        const savePromise = this.userRepository.save(user);
        return makeObservable(savePromise).pipe(
            catchError(err => errThrowerBuilder(err, 'POST 凭据字段不全，应该有 username 以及 password', HttpStatus.PAYMENT_REQUIRED)),
        );
    }
    public findByOffsetAndLimit(userId: string, offset = 0, limit = 10) {
        if (!!userId) {
            return this.findOne(userId);
        }
        const builder = this.userRepository.createQueryBuilder('user')
            .select(['user.username', 'user.id', 'user.createdAt'])
            .offset(offset)
            .limit(limit)
            .getMany();
        return makeObservable<User | User[]>(builder).pipe(
            catchError(err => errThrowerBuilder(err, `分页查询用户出错`, HttpStatus.INTERNAL_SERVER_ERROR)),
        );
    }

    public findOne(uid: string) {
        const userPromise = this.userRepository
            .createQueryBuilder('user')
            .select(['user.username', 'user.id', 'user.createdAt'])
            .where('id = :uid', { uid })
            .getOne();
        return makeObservable(userPromise).pipe(
            catchError(err => errThrowerBuilder(err, `用户 id ${uid} 不存在`, HttpStatus.NOT_FOUND)),
        );
    }

    public countAllUser() {
        return makeObservable(this.userRepository.findAndCount()).pipe(map(([users, counter]) => counter));
    }

    /**
     * 根据用户 id 获取最近 10 条日志
     */
    public getLogsByUserId(userId: string, sort: { offset: number, limit: number }) {
        if (!sort || !sort.limit || !sort.offset) { sort = { offset: 0, limit: 10 }; }
        const logPromise = this.logRepository
            .createQueryBuilder('log')
            .orderBy('commented_at', 'DESC')
            .where(`log.userId = :userId`, { userId })
            .offset(sort.offset)
            .limit(sort.limit)
            .getMany();
        return makeObservable(logPromise).pipe(
            catchError(err => throwError(new HttpException(`查询用户<${userId}>日志时出现错误: ${err.message}`, HttpStatus.SERVICE_UNAVAILABLE))),
        );
    }

    /**
     * 根据用户 id 获取用户，附带最近的 10 条 log 记录
     */
    public getUserWithLatestLog(userId: string, sort: { offset: number, limit: number }) {
        const user$ = this.findOne(userId);
        const log$ = this.getLogsByUserId(userId, sort);
        return combineLatest([user$, log$]).pipe(
            map(([user, log]) => {
                user.log = log || [];
                return user;
            }),
        );
    }
}
