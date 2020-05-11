import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Repository } from 'typeorm';
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
        private readonly commentRepository: Repository<Comment>
    ) {}
    public findByOffsetAndLimit(offset = 0, limit = 10) {
        const builder = this.userRepository
            .createQueryBuilder('user')
            .select(['user.username', 'user.id', 'user.createdAt'])
            .offset(offset)
            .limit(limit)
            .getMany();
        return makeObservable<User | User[]>(builder).pipe(
            catchError(err => errThrowerBuilder(err, `分页查询用户出错`, HttpStatus.INTERNAL_SERVER_ERROR))
        );
    }

    /**
     *
     * @see `user.entity.ts`
     * UserId & Username is unique property in user table
     */
    public findOne(userIdOrName: string) {
        const userPromise = this.userRepository
            .createQueryBuilder('user')
            .select(['user.username', 'user.id', 'user.createdAt'])
            .where('user.id = :property OR user.username = :property', { property: userIdOrName })
            .getOne();
        return makeObservable(userPromise).pipe(
            switchMap(user => (user instanceof User ? of(user) : throwError(`${userIdOrName} 不存在`))),
            catchError(err => errThrowerBuilder(err, `用户 ${userIdOrName} 不存在`, HttpStatus.NOT_FOUND))
        );
    }

    /**
     * 根据用户 id 获取最近 10 条日志
     */
    public getCommentsByUserId(userId: string, offset = 0, limit = 0) {
        const commentPromise = this.commentRepository
            .createQueryBuilder('comment')
            .select(['comment.id', 'comment.content', 'comment.commentedAt'])
            .orderBy('commented_at', 'DESC')
            .where(`comment.userId = :userId`, { userId })
            .offset(offset)
            .limit(limit)
            .getMany();
        return makeObservable(commentPromise).pipe(
            catchError(err =>
                throwError(
                    new HttpException(
                        `查询用户<${userId}>日志时出现错误: ${err.message}`,
                        HttpStatus.SERVICE_UNAVAILABLE
                    )
                )
            )
        );
    }

    /**
     * 根据用户 id 获取用户，附带最近的 10 条 comment 记录
     */
    public getUserWithLatestComment(userId: string, offset = 0, limit = 10) {
        // TODO: try using innerJoin for connect `user` & `comment`
        const user$ = this.findOne(userId) as Observable<User>;
        const comment$ = this.getCommentsByUserId(userId, offset, limit);
        return combineLatest([user$, comment$]).pipe(
            map(([user, comment]) => {
                user.comment = comment || [];
                return user;
            })
        );
    }
}
