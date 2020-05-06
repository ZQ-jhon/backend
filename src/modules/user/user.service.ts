import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { combineLatest, throwError, Observable, of } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { errThrowerBuilder } from '../../util/err-thrower-builder';
import { makeObservable } from '../../util/make-observable';
import { Comment } from '../comment/comment.entity';
import { User } from './user.entity';
import { AuthService } from './auth.service';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        private readonly authService: AuthService,
    ) { }

    public save(user: User) {
        if (!user.id) { user.id = v4(); }
        const save$ = makeObservable(this.userRepository.save(user));
        const error$ = errThrowerBuilder(new Error('用户已存在'), '用户已存在，无法重复创建', HttpStatus.BAD_REQUEST);
        return this.checkUserIsExist(user).pipe(
            switchMap(exist => exist ? error$ : save$),
        )
    }
    public findByOffsetAndLimit(offset = 0, limit = 10) {
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
        ).pipe(map(u => !!u));
    }

    public findOne(userIdOrUsername: string) {
        const userPromise = this.userRepository
            .createQueryBuilder('user')
            .select(['user.username', 'user.id', 'user.createdAt'])
            .where('user.id = :uid OR user.username = :username', { uid: userIdOrUsername, username: userIdOrUsername })
            .getOne();
        return makeObservable(userPromise).pipe(
            switchMap(user => user instanceof User ? of(user) : throwError(`${userIdOrUsername} 不存在`)),
            catchError(err => errThrowerBuilder(err, `用户 ${userIdOrUsername} 不存在`, HttpStatus.NOT_FOUND)),
        );
    }

    public findUserByUsername(username: string) {
        const promise = this.userRepository.createQueryBuilder('user')
            .select(['user.username'])
            .where('user.username = :username', { username })
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
    public getCommentsByUserId(userId: string, offset = 0, limit = 0) {
        const commentPromise = this.commentRepository
            .createQueryBuilder('comment')
            .orderBy('commented_at', 'DESC')
            .where(`comment.userId = :userId`, { userId })
            .offset(offset)
            .limit(limit)
            .getMany();
        return makeObservable(commentPromise).pipe(
            catchError(err => throwError(new HttpException(`查询用户<${userId}>日志时出现错误: ${err.message}`, HttpStatus.SERVICE_UNAVAILABLE))),
        );
    }

    /**
     * 根据用户 id 获取用户，附带最近的 10 条 comment 记录
     */
    public getUserWithLatestComment(userIdOrUsername: string, offset = 0, limit = 10) {
        // TODO: try using innerJoin for connect `user` & `comment`
        const user$ = this.findOne(userIdOrUsername) as Observable<User>;
        const comment$ = this.getCommentsByUserId(userIdOrUsername, offset, limit);
        return combineLatest([user$, comment$]).pipe(
            map(([user, comment]) => {
                user.comment = comment || [];
                return user;
            }),
        );
    }

    /**
     * matchOneByPayload
     */
    public tryLogin(payload: { username: string, password: string }) {
        const promise = this.userRepository.createQueryBuilder('user')
            .where(`user.password = :pwd AND user.username = :username`, { pwd: payload.password, username: payload.username })
            .select(['user.id', 'user.username'])
            .getOne();
        return makeObservable(promise).pipe(
            switchMap(u => !!u ? of(u) : errThrowerBuilder(new Error('Authorization failed!'), '用户名或密码错误', HttpStatus.FORBIDDEN)),
        );
    }
}
