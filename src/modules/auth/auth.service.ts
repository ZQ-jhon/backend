import { Injectable, HttpStatus, HttpException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { switchMap, map } from 'rxjs/operators';
import { of, defer, from, throwError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import { UserDto } from '../user/user.dto';
import { plainToClass } from 'class-transformer';
import { createHmac } from 'crypto';
import { v4 } from 'uuid';
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }
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
        return from(promise).pipe(
            switchMap(u => (!!u ? of(u) : throwError(new HttpException('Authorization failed!', HttpStatus.FORBIDDEN))))
        );
    }

    public isUserExist(user: User) {
        return from(
            this.userRepository
                .createQueryBuilder('user')
                .where('user.username = :id OR user.username = :name', { id: user.id, name: user.username })
                .getOne()
        ).pipe(map(user => !isNil(user)));
    }

    public createUser(userDTO: UserDto) {
        const user = plainToClass(User, userDTO);
        const { algorithm, mixinPassword, secret } = this.crypto(user.password);
        user.algorithm = algorithm;
        user.password = mixinPassword;
        user.secret = secret;
        const save$ = defer(() =>
            from(this.userRepository.save(user)).pipe(
                map(user => {
                    delete user.password;
                    return user as Omit<User, 'password'>;
                })
            )
        );
        const error$ = of(new HttpException('用户已存在', HttpStatus.BAD_REQUEST));
        return this.isUserExist(user).pipe(switchMap(exist => (exist ? error$ : save$)));
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
        return this.jwtService.sign({ username, userId }, { algorithm: 'HS256', expiresIn: '24h' });
    }
    public decodeJWT(token: string) {
        return this.jwtService.decode(token);
    }

    public refreshToken(token: string) {
        if (isNil(this.decodeJWT(token))) {
            throw new BadRequestException('Token format error, check and confirm your token is full again!');
        }
        const { username, userId } = this.decodeJWT(token) as { username: string; userId: string };
        try {
            this.jwtService.verify(token);
            return token;
        } catch (err) {
            return this.signJWT(username, userId);
        }
    }


    private crypto(password: string, secret = v4(), ) {
        if (!password) { return; }
        const algorithm = 'sha256';
        const mixinPassword = createHmac(algorithm, secret)
            .update(password + secret)
            .digest('base64');

        return { algorithm, mixinPassword, secret };

    }
}
