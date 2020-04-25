import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { combineLatest, throwError } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { errThrowerBuilder } from '../../util/err-thrower-builder';
import { makeObservable } from '../../util/make-observable';
import { Comment } from '../comment/comment.entity';
import { User } from './user.entity';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) { }

    public save(user: User) {
        if (!user.id) { user.id = v4(); }
        const save$ = makeObservable(this.userRepository.save(user));
        const error$ = errThrowerBuilder(new Error('用户已存在'), '用户已存在，无法重复创建', HttpStatus.BAD_REQUEST);
        return this.checkUserIsExist(user).pipe(
            switchMap(exist => exist ? error$ : save$),
        )
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

    /**
     * check user is exist
     * @returns Observable<boolean>
     */
    public checkUserIsExist(user: User) {
        return makeObservable(
            this.userRepository.createQueryBuilder('user')
                .where('user.username = :id', { id: user.username })
                .getOne()
        ).pipe(map(u => !!user));
    }

    public findOne(userId: string) {
        const userPromise = this.userRepository
            .createQueryBuilder('user')
            .select(['user.username', 'user.id', 'user.createdAt'])
            .where('id = :uid', { uid: userId })
            .getOne();
        return makeObservable(userPromise).pipe(
            catchError(err => errThrowerBuilder(err, `用户 id ${userId} 不存在`, HttpStatus.NOT_FOUND)),
        );
    }

    public findUserByUsername(username: string) {
        const promise = this.userRepository.createQueryBuilder('user')
            .select(['user.username'])
            .where('username = :username', { username })
            .getOne();
        return makeObservable(promise).pipe(
            catchError(err => errThrowerBuilder(err, `用户 ${username} 已存在，不允许重复创建`, HttpStatus.BAD_REQUEST)),
        );
    }

    public countAllUser() {
        return makeObservable(this.userRepository.findAndCount()).pipe(map(([users, counter]) => counter));
    }

    /**
     * 根据用户 id 获取最近 10 条日志
     */
    public getCommentsByUserId(userId: string, sort: { offset: number, limit: number }) {
        if (!sort || !sort.limit || !sort.offset) { sort = { offset: 0, limit: 10 }; }
        const commentPromise = this.commentRepository
            .createQueryBuilder('comment')
            .orderBy('commented_at', 'DESC')
            .where(`comment.userId = :userId`, { userId })
            .offset(sort.offset)
            .limit(sort.limit)
            .getMany();
        return makeObservable(commentPromise).pipe(
            catchError(err => throwError(new HttpException(`查询用户<${userId}>日志时出现错误: ${err.message}`, HttpStatus.SERVICE_UNAVAILABLE))),
        );
    }

    /**
     * 根据用户 id 获取用户，附带最近的 10 条 comment 记录
     */
    public getUserWithLatestComment(userId: string, sort: { offset: number, limit: number }) {
        const user$ = this.findOne(userId);
        const comment$ = this.getCommentsByUserId(userId, sort);
        return combineLatest([user$, comment$]).pipe(
            map(([user, comment]) => {
                user.comment = comment || [];
                return user;
            }),
        );
    }
}
