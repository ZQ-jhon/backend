import { Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { makeObservable } from '../../util/make-observable';
import { switchMap, map, tap } from 'rxjs/operators';
import { of, defer } from 'rxjs';
import { errThrowerBuilder } from '../../util/err-thrower-builder';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from 'lodash';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}
    /**
     * matchOneByPayload
     */
    public login(payload: { username: string; password: string }) {
        const promise = this.userRepository
            .createQueryBuilder('user')
            .where(`user.password = :pwd AND user.username = :username`, {
                pwd: payload.password,
                username: payload.username,
            })
            .select(['user.username', 'user.id', 'user.createdAt'])
            .getOne();
        return makeObservable(promise).pipe(
            switchMap(u =>
                !!u
                    ? of(u)
                    : errThrowerBuilder(new Error('Authorization failed!'), '用户名或密码错误', HttpStatus.FORBIDDEN)
            )
        );
    }

    public isUserExist(user: User) {
        return makeObservable(
            this.userRepository
                .createQueryBuilder('user')
                .where('user.username = :id OR user.username = :name', { id: user.id, name: user.username })
                .getOne()
        ).pipe(map(user => !isNil(user)));
    }

    public createUser(user: User) {
        if (!user.createdAt) {
            user.createdAt = new Date();
        }
        const save$ = makeObservable(this.userRepository.save(user)).pipe(
            map(user => {
                delete user.password;
                return user;
            })
        );
        const error$ = errThrowerBuilder(new Error('用户已存在'), '用户已存在，无法重复创建', HttpStatus.BAD_REQUEST);
        return this.isUserExist(user).pipe(
            switchMap(exist => exist ? error$ : defer(() => save$)),
        );
    }

    public signJWT(username: string, userId: string) {
        // 10 min
        // {
        //   "id": "9ssss",
        //   "iat": 1587918733,
        //   "exp": 1588523533,
        //   "aud": "username",
        //   "iss": "Micro-Service-Name",
        //   "sub": "from-application"
        // }
        return this.jwtService.sign({ username, userId }, { algorithm: 'HS256', expiresIn: '1d' });
    }
    public decodeJWT(token: string) {
        return this.jwtService.decode(token);
    }

    public refreshToken(token: string) {
        const { username, userId } = this.decodeJWT(token) as { username: string; userId: string };
        try {
            this.jwtService.verify(token);
            return token;
        } catch (err) {
            return this.signJWT(username, userId);
        }
    }
}
